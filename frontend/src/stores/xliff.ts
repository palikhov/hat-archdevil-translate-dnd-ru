import {acceptHMRUpdate, defineStore} from 'pinia'

import {XliffFileRecord} from '../client/schemas/XliffFileRecord'
import {XliffFileWithRecordsCount} from '../client/schemas/XliffFileWithRecordsCount'
import {XliffSubstitution} from '../client/schemas/XliffSubstitution'
import {
  getDownloadXliffLink,
  getSegmentSubstitutions,
  getXliff,
  getXliffRecords,
  updateXliffRecord,
} from '../client/services/XliffService'

export interface XliffFileRecordWithStatus extends XliffFileRecord {
  loading: boolean
}

export const useXliffStore = defineStore('xliff', {
  state() {
    return {
      documentLoading: false,
      document: undefined as XliffFileWithRecordsCount | undefined,
      records: [] as XliffFileRecordWithStatus[],
      currentFocusIdx: undefined as number | undefined,
      downloadLink: undefined as string | undefined,
      substitutions: [] as XliffSubstitution[],
    }
  },
  actions: {
    async loadDocument(doc_id: number) {
      this.documentLoading = true
      this.currentFocusIdx = undefined
      this.document = undefined
      this.document = await getXliff(doc_id)
      this.downloadLink = getDownloadXliffLink(this.document.id)
      this.documentLoading = false
    },
    async loadRecords(page: number) {
      if (!this.document) {
        return
      }
      this.records = (await getXliffRecords(this.document.id, page)).map(
        (record) => ({...record, loading: false})
      )
    },
    async updateRecord(record_id: number, content: string) {
      if (!this.document) {
        return
      }

      const idx = this.records.findIndex((record) => record.id === record_id)
      if (idx < 0) {
        console.warn('Record not found')
        return
      }
      this.records[idx].loading = true
      await updateXliffRecord(this.document?.id, record_id, {
        target: content,
      })
      this.records[idx].loading = false
    },
    async focusSegment(idx: number) {
      this.currentFocusIdx = idx
      await this.loadSubstitutions()
    },
    focusNextSegment() {
      if (
        this.currentFocusIdx &&
        this.currentFocusIdx < this.records.length - 1
      ) {
        this.currentFocusIdx += 1
      }
    },
    async loadSubstitutions() {
      if (!this.document || this.currentFocusIdx === undefined) {
        this.substitutions = []
        return
      }

      this.substitutions = await getSegmentSubstitutions(
        this.document.id,
        this.currentFocusId!
      )
    },
  },
  getters: {
    documentReady: (state) =>
      state.document &&
      (state.document.status == 'done' || state.document.status == 'error'),
    currentFocusId: (state) =>
      state.records && state.currentFocusIdx !== undefined
        ? state.records[state.currentFocusIdx].id
        : undefined,
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useXliffStore, import.meta.hot))
}
