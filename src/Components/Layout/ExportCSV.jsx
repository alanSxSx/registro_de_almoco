import React from "react";
import { Button } from "primereact/button";

function ExportCSV({ onExport }) {
  return (
    <Button
      label="Export"
      icon="pi pi-upload"
      className="p-button-help w-12 md:w-12"
      onClick={onExport}
    />
  );
}

export default ExportCSV;
