import { create } from 'zustand';
import {getDatabases} from "../utils/biz";

interface DatabaseState {
  databases: any[]
  reset: () => void
  setDatabases: (args: any[]) => void
}

const useDatabaseStore = create((set): DatabaseState => ({
  databases: [],
  reset: () => {
    set({databases: []})
  },
  setDatabases: (data: any[]) => {
    set({databases: getDatabases(data)})
  }
}))

export {
  useDatabaseStore,
  DatabaseState
};