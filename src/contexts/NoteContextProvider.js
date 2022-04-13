import React, { createContext } from 'react'

const NoteContext = createContext();

function NoteContextProvider({children, value}) {

  return (
    <NoteContext.Provider value={value}>
        {children}
    </NoteContext.Provider>
  )
}

export default NoteContextProvider;