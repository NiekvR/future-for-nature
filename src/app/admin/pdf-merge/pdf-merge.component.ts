import { Component } from '@angular/core';
import { from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'ffn-pdf-merge',
  templateUrl: './pdf-merge.component.html',
  styleUrl: './pdf-merge.component.scss'
})
export class PdfMergeComponent {
  public uploadedPdfs: File[] = [];
  public mergedPdf: Uint8Array | null = null;
  public newFileName: string = 'merged_pdf.pdf';

  trackByFile(index: number, file: File) {
    return file;
  }

  constructor(private afAuth: AngularFireAuth, private router: Router, private location: Location) { }

  public uploadFiles(event:Event)  {
    // @ts-ignore
    this.uploadedPdfs.push(...event?.target?.files);
    console.log(this.uploadedPdfs);
  }

  public removeFile(index: number) {
    this.uploadedPdfs.splice(index, 1);
  }

  public moveFile(index: number, direction: number) {
    console.log()
    const file = this.uploadedPdfs.splice(index, 1);
    this.uploadedPdfs.splice(index + direction, 0, file[ 0 ]);
  }

  public mergeFiles() {
    this.coordinateMergePDFs();
  }

  async coordinateMergePDFs() {
    const pdfs = await Promise.all(this.uploadedPdfs.map(file => this.readPDF(file)));
    this.mergedPdf = await this.mergePDFsIntoOne(pdfs);
    console.log(this.mergedPdf);
  }


  async readPDF(file: File): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(new Uint8Array(event.target.result as ArrayBuffer));
        } else {
          reject('Could not read the PDF file');
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  /** this function is merging PDFs and return the PDFs data as a Unit8Array*/
  async mergePDFsIntoOne(pdfs: Uint8Array[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();
    for (const pdfBytes of pdfs) {
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
    return await mergedPdf.save();
  }

  downloadMergedPDF() {
    if (!this.mergedPdf) {
      return;
    }
    const blob = new Blob([this.mergedPdf], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;

    // Verwenden Sie den Wert aus dem Textfeld als Dateinamen
    a.download = this.newFileName; // Hier wird der Dateiname aus dem Textfeld verwendet

    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  public logOut() {
    from(this.afAuth.signOut())
      .subscribe(() => this.router.navigate(['/login']));
  }

  public back() {
    this.location.back();
  }

}
