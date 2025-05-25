import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {extensions} from "@/constants";
import {FileType} from "next/dist/lib/file-exists";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStringify(value: unknown) {
  return JSON.parse(JSON.stringify(value))
}

export function getFileTypes(filename:string){
  const ext = filename.split('.').pop()?.toLowerCase()
  if (!ext) return { type: "other", extension: "" };

  const document = extensions.documents.includes(ext)
  if(document) return {type: "document", ext}

  const images = extensions.images.includes(ext)
  if(images) return {type: "images", ext}

  const videos = extensions.videos.includes(ext)
  if(videos) return {type: "videos", ext}

  const audios = extensions.audios.includes(ext)
  if(audios) return {type: "audios", ext}

  return {type: "other", ext}
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function getFileIcons(ext: string | undefined, type: FileType | string) {
  switch (ext) {
      // Document
    case "pdf":
      return "/assets/icons/file-pdf.svg";
    case "doc":
      return "/assets/icons/file-doc.svg";
    case "docx":
      return "/assets/icons/file-docx.svg";
    case "csv":
      return "/assets/icons/file-csv.svg";
    case "txt":
      return "/assets/icons/file-txt.svg";
    case "xls":
    case "xlsx":
      return "/assets/icons/file-document.svg";
      // Image
    case "svg":
      return "/assets/icons/file-image.svg";
      // Video
    case "mkv":
    case "mov":
    case "avi":
    case "wmv":
    case "mp4":
    case "flv":
    case "webm":
    case "m4v":
    case "3gp":
      return "/assets/icons/file-video.svg";
      // Audio
    case "mp3":
    case "mpeg":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "m4a":
    case "aiff":
    case "alac":
      return "/assets/icons/file-audio.svg";

    default:
      switch (type) {
        case "image":
          return "/assets/icons/file-image.svg";
        case "document":
          return "/assets/icons/file-document.svg";
        case "video":
          return "/assets/icons/file-video.svg";
        case "audio":
          return "/assets/icons/file-audio.svg";
        default:
          return "/assets/icons/file-other.svg";
      }
  }
}

export function constructFileUrl(bucketFileId: string) {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
}