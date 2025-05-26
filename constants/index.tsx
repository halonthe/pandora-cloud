export const navigation = [
	{name: 'Dashboard', href: '/', icons:'/assets/icons/dashboard.svg'},
	{name: 'Documents', href: '/documents', icons:'/assets/icons/documents.svg'},
	{name: 'Images', href: '/images', icons:'/assets/icons/images.svg'},
	{name: 'Media', href: '/media', icons:'/assets/icons/video.svg'},
	{name: 'Others', href: '/others', icons:'/assets/icons/others.svg'},
]

export const dropdownMenu = [
	{label: 'Rename', icon: '/assets/icons/edit.svg', value: 'rename'},
	{label: 'Delete', icon: '/assets/icons/delete.svg', value: 'delete'},
	{label: 'Download', icon: '/assets/icons/download.svg', value: 'download'},
	{label: 'Share', icon: '/assets/icons/share.svg', value: 'share'},
	{label: 'Details', icon: '/assets/icons/info.svg', value: 'details'},
]

export const maxFileSize = 50 * 1024 * 1024; // 50 MB

export const extensions = {
	images: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'],
	videos: ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm', 'vob', 'ogv', 'ogg', 'drc', 'gifv', 'mng', 'qt', 'rm', 'rmvb', 'asf', 'amv', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'm4p', 'm4v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b'],
	audios: ["mp3", "wav", "ogg", "flac"],
	documents: [
		".txt",  // Teks biasa
		".pdf",  // PDF
		".doc",  // Microsoft Word (versi lama)
		".docx", // Microsoft Word (versi baru)
		".xlsx", // Microsoft Excel
		".pptx", // Microsoft PowerPoint
		".csv",  // CSV
		".json", // JSON
		".md",   // Markdown
		".html", // HTML
		".js",   // JavaScript
		".ts",   // TypeScript
		".jsx",  // JSX
		".tsx",  // TSX
		".py",   // Python
		".java", // Java
		".go",   // Go
		".c",    // C
		".cpp",  // C++
		".cs",   // C#
		".rb",   // Ruby
		".php",  // PHP
		".sh",   // Shell script
		".tex",  // LaTeX
		".zip",  // Arsip ZIP
		".tar",  // Arsip TAR
		".pkl",  // Pickle (Python)
		".gif",  // Gambar GIF
		".jpeg", // Gambar JPEG
		".jpg",  // Gambar JPG
		".png",  // Gambar PNG
		".webp"  // Gambar WebP
	]
}

export const sortTypes = [
	{
		label: "Date created (newest)",
		value: "$createdAt-desc",
	},
	{
		label: "Created Date (oldest)",
		value: "$createdAt-asc",
	},
	{
		label: "Name (A-Z)",
		value: "name-asc",
	},
	{
		label: "Name (Z-A)",
		value: "name-desc",
	},
	{
		label: "Size (Highest)",
		value: "size-desc",
	},
	{
		label: "Size (Lowest)",
		value: "size-asc",
	},
];