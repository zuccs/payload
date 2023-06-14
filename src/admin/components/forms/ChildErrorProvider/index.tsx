import React, {
  createContext, useContext, useState, useRef, useCallback,
} from 'react';

type ChildErrorContextType = null | Set<string>
type SetChildErrorContextType = {
  addPath?: (path: string) => void,
  removePath?: (path: string) => void,
}

const ChildErrorContext = createContext<ChildErrorContextType>(null);
const SetChildErrorContext = createContext<SetChildErrorContextType>({});

export const ChildErrorProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [childErrorPaths, setChildErrorPaths] = useState<Set<string>>(() => new Set());
  const { addPath: addPathToParent, removePath: removePathFromParent } = useSetChildErrorPaths();

  const addPath = useCallback((path: string) => {
    setChildErrorPaths((existingPaths) => {
      const paths = new Set([...existingPaths]);
      paths.add(path);
      return paths;
    });
    if (addPathToParent) addPathToParent(path);
  }, [addPathToParent]);

  const removePath = useCallback((path: string) => {
    setChildErrorPaths((existingPaths) => {
      const paths = new Set([...existingPaths]);
      paths.delete(path);
      return paths;
    });
    if (removePathFromParent) removePathFromParent(path);
  }, [removePathFromParent]);

  const modifyStateContext = useRef({
    addPath,
    removePath,
  });

  return (
    <ChildErrorContext.Provider value={childErrorPaths}>
      <SetChildErrorContext.Provider value={modifyStateContext.current}>
        {children}
      </SetChildErrorContext.Provider>
    </ChildErrorContext.Provider>
  );
};

export const useChildErrorPaths = () => useContext(ChildErrorContext);
export const useSetChildErrorPaths = () => useContext(SetChildErrorContext);
