import { useEffect } from "react";

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title ? `${title} | LM Autos` : "LM Autos - Consignataria de Vehículos en Colombia";
  }, [title]);
};

export default usePageTitle;
