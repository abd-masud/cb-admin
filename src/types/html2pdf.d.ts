declare module 'html2pdf.js' {
    interface Html2PdfOptions {
        margin?: number | [number, number, number, number];
        filename?: string;
        image?: { type: string; quality: number };
        html2canvas?: {
            scale?: number;
            useCORS?: boolean;
            allowTaint?: boolean;
            logging?: boolean;
            letterRendering?: boolean;
        };
        jsPDF?: {
            unit?: string;
            format?: string | number[];
            orientation?: 'portrait' | 'landscape';
        };
        pagebreak?: { mode?: string | string[] };
    }

    interface Html2Pdf {
        set(options: Html2PdfOptions): Html2Pdf;
        from(element: HTMLElement): Html2Pdf;
        toPdf(): Html2Pdf;
        toCanvas(): Html2Pdf;
        toImg(): Html2Pdf;
        save(filename?: string): Promise<void>;
        output(type: 'datauristring'): Promise<string>;
        output(type: 'dataurlstring'): Promise<string>;
        output(type: 'dataurl'): Promise<string>;
        output(type: 'blob'): Promise<Blob>;
        output(type: 'pdf'): Promise<Uint8Array>;
        output(type: 'arraybuffer'): Promise<ArrayBuffer>;
        output(type: 'base64'): Promise<string>;
        outputPdf(): Promise<Uint8Array>;
        outputImg(): Promise<string>;
    }

    const html2pdf: () => Html2Pdf;
    export = html2pdf;
}