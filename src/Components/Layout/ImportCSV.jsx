import React from "react";
import { FileUpload } from "primereact/fileupload";


function ImportCSV({ onImportCSV }) {

  const importCSV = (e) => {
    const file = e.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const data = csv.split("\n");

      // Prepare DataTable
      const cols = data[0].replace(/['"]+/g, "").split(",");
      data.shift();

      const importedData = data.map((d) => {
        d = d.split(",");
        const processedData = cols.reduce((obj, c, i) => {
          c =
            c === "Status"
              ? "inventoryStatus"
              : c === "Reviews"
              ? "rating"
              : c.toLowerCase();
          obj[c] = d[i].replace(/['"]+/g, "");
          (c === "price" || c === "rating") && (obj[c] = parseFloat(obj[c]));
          return obj;
        }, {});

        processedData["id"] = createId();
        return processedData;
      });

      onImportCSV(importedData);
    };

    reader.readAsText(file, "UTF-8");
  };

  return (
    <FileUpload
      mode="basic"
      name="demo[]"
      auto
      url="https://primefaces.org/primereact/showcase/upload.php"
      accept=".csv"
      chooseLabel="Import"
      className="mr-2 w-12 md:w-12 m-0"
      onUpload={importCSV}
    />
  );
}

export default ImportCSV;