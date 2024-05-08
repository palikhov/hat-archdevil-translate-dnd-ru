import {writeFileSync} from 'fs'
import {platform} from 'os'

import {ArrayDesc, PropDescription, TrivialDesc} from './interfaces'

export const getReferencedType = (ref: string): string => {
  // TODO: it should be done better, not by just splitting the string
  return ref.split('/').pop() ?? ''
}

export const getImports = (
  types: Iterable<string>,
  schemasPath: string
): string => {
  const imports: string[] = []
  for (const type of types) {
    imports.push(`import {${type}} from '${schemasPath}${type}'`)
  }
  return `${imports.join('\n')}` + (imports.length > 0 ? '\n\n' : '')
}

export function tsType(prop: PropDescription): string {
  if ('$ref' in prop) {
    return getReferencedType(prop.$ref)
  }

  switch (prop.type) {
    case 'string': {
      if ('format' in prop && prop.format == 'binary') {
        return 'Blob'
      }

      return 'string'
    }
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array': {
      if (prop.items) {
        // TODO: call tsType recursively?
        if ('$ref' in prop.items) {
          const ref = prop.items.$ref
          return `${getReferencedType(ref)}[]`
        } else if ('anyOf' in prop.items) {
          const elems = prop.items.anyOf
          return `(${elems
            .map((val) => tsType({type: val.type}))
            .join(' | ')})[]`
        } else {
          console.warn('Unsupported array items:', prop.items)
          return 'any[]'
        }
      } else {
        console.warn('Unsupported array type:', prop.items)
        return 'any[]'
      }
    }
    default:
      console.warn('Unsupported type:', (prop as TrivialDesc | ArrayDesc).type)
      return 'any'
  }
}

function getOperatingSystem() {
  const pltf = platform()
  if (pltf === 'win32') {
    return 'Windows'
  } else if (pltf === 'linux') {
    return 'Linux'
  } else {
    return 'Other'
  }
}

const autogenPrologue =
  '// This file is autogenerated, do not edit directly.\n\n'

export function writeGeneratedContent(file: string, content: string): void {
  const endl = getOperatingSystem() === 'Windows' ? '\r\n' : '\n'
  const newContent = (autogenPrologue + content).replace(/(\r\n|\r|\n)/g, endl)
  writeFileSync(file, newContent)
}
