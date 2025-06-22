import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
