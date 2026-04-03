import React, { useEffect } from "react";

declare global {
  interface Window {
    luckysheet: any;
  }
}

interface Props {
  value: any;
  onChange: (data: any) => void;
}

const ExcelTemplate: React.FC<Props> = ({ value, onChange }) => {
  useEffect(() => {
    if (!window.luckysheet) return;

    window.luckysheet.destroy();

    window.luckysheet.create({
      container: "luckysheet-container",
      showinfobar: false,
      lang: "en",

      // only one sheet
      showsheetbar: false,

      allowEdit: true,

      data: value
        ? JSON.parse(value).map((sheet: any, index: number) => ({
            name: sheet.name,
            index: index,
            status: 1,
            data: sheet.data,
          }))
        : [
            {
              name: "Template",
              index: 0,
              status: 1,
              data: [],
            },
          ],

      hook: {
        updated: () => {
          const sheets = window.luckysheet.getAllSheets();

          const formatted = sheets.map((sheet: any) => ({
            name: sheet.name || "Template",
            data: sheet.data ? sheet.data : [],
          }));

          onChange(JSON.stringify(formatted, null, 2));
        },
      },
    });
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        border: "1px solid #dcdcdc",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Inline CSS Fix */}
      <style>
        {`
        #luckysheet-container{
          width:100%;
          height:100%;
        }

        .luckysheet{
          width:100% !important;
        }

        /* Toolbar scroll */
        .luckysheet-toolbar{
          width:100%;
          overflow-x:auto !important;
          overflow-y:hidden !important;
          white-space:nowrap;
        }

        .luckysheet-toolbar > div{
          display:inline-block;
          min-width:1200px;
        }

        .luckysheet-grid-container{
          overflow:auto !important;
        }

        /* Scrollbar style */
        .luckysheet-toolbar::-webkit-scrollbar{
          height:6px;
        }

        .luckysheet-toolbar::-webkit-scrollbar-thumb{
          background:#ccc;
          border-radius:4px;
        }
        `}
      </style>

      <div
        id="luckysheet-container"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default ExcelTemplate;
