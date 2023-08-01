import React, { useContext } from "react";

export const DataContext = React.createContext<any>(null!);

export const useDataUpdate = () => {
  return useContext(DataContext);
};
