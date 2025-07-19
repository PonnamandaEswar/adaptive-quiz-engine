'use client';

import React, { useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/build/pdf.worker.entry';

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pdfText, setPdfText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    setPdfText(null);

    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + ' ';
    }

    setPdfText(text.slice(0, 3000)); // Limit for demo/hackathon
    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="bg-zinc-900 border border-zinc-700 p-10 rounded-2xl shadow-2xl w-full max-w-lg space-y-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Upload a PDF to Generate MCQs</h2>
        <div
          className="border-2 border-dashed border-blue-500 p-10 rounded-xl bg-zinc-800 text-blue-400 font-semibold cursor-pointer hover:bg-blue-900 transition mb-3"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          Drag & Drop your PDF here<br/>or click to select
          <input
            type="file"
            accept="application/pdf"
            hidden
            ref={fileInputRef}
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />
        </div>
        {loading && <div className="text-white">Extracting PDF text...</div>}
        {pdfText && (
          <div className="text-sm mt-4 bg-zinc-800 p-3 rounded text-white text-left max-h-48 overflow-y-auto">
            <b>PDF Text Preview:</b>
            <br />
            {pdfText}
          </div>
        )}
      </div>
    </div>
  );
}
