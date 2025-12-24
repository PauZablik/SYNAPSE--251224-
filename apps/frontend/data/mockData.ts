import {
  Project,
  Section,
  Folder,
  Document,
  SectionType,
  DocumentType,
  DocumentStatus,
  AxisDirection,
  type DocumentMetadata,
  type BOMEntry,
  type AxisData,
} from "@/types";

// Mock Bill of Materials entries
const mockBOM: BOMEntry[] = [
  {
    position: "1",
    name: "Балка двутавровая 20Б1",
    weight: 45.5,
    quantity: 12,
    totalWeight: 546.0,
  },
  {
    position: "2",
    name: "Колонна 30К1",
    weight: 78.3,
    quantity: 8,
    totalWeight: 626.4,
  },
  {
    position: "3",
    name: "Связи С1",
    weight: 12.5,
    quantity: 24,
    totalWeight: 300.0,
  },
  {
    position: "4",
    name: "Прогон П1",
    weight: 22.1,
    quantity: 36,
    totalWeight: 795.6,
  },
];

// Mock axes data
const mockAxes: AxisData[] = [
  { direction: AxisDirection.HORIZONTAL, label: "А", position: 0 },
  { direction: AxisDirection.HORIZONTAL, label: "Б", position: 6000 },
  { direction: AxisDirection.HORIZONTAL, label: "В", position: 12000 },
  { direction: AxisDirection.HORIZONTAL, label: "Г", position: 18000 },
  { direction: AxisDirection.HORIZONTAL, label: "Д", position: 24000 },
  { direction: AxisDirection.VERTICAL, label: "1", position: 0 },
  { direction: AxisDirection.VERTICAL, label: "2", position: 6000 },
  { direction: AxisDirection.VERTICAL, label: "3", position: 12000 },
  { direction: AxisDirection.VERTICAL, label: "4", position: 18000 },
  { direction: AxisDirection.VERTICAL, label: "5", position: 24000 },
  { direction: AxisDirection.VERTICAL, label: "6", position: 30000 },
  { direction: AxisDirection.VERTICAL, label: "7", position: 36000 },
  { direction: AxisDirection.VERTICAL, label: "8", position: 42000 },
];

// Mock metadata for КМ documents
const mockKMMetadata: DocumentMetadata = {
  customer: 'ООО "СтройМонтаж"',
  projectObject: "Складской комплекс",
  address: "Московская область, г. Подольск, Промзона Север",
  axes: mockAxes,
  elevationMarks: [0.0, 3.6, 7.2, 10.8],
  billOfMaterials: mockBOM,
};

// Create mock project structure
export function createMockProject(): Project {
  // КМ Section
  const kmSection: Section = {
    id: "section-km",
    name: "КМ - Металлические конструкции",
    type: SectionType.KM,
    projectId: "project-1",
    folders: [
      {
        id: "folder-km-proekt",
        name: "Проект",
        sectionId: "section-km",
        documents: [
          {
            id: "doc-km-ar",
            name: "КМ-АР.pdf",
            type: DocumentType.PROJECT,
            uploadDate: "2024-12-20T10:30:00Z",
            status: DocumentStatus.ANALYZED,
            metadata: mockKMMetadata,
            folderId: "folder-km-proekt",
          },
          {
            id: "doc-km-vedomost",
            name: "КМ-Ведомость.xlsx",
            type: DocumentType.PROJECT,
            uploadDate: "2024-12-20T11:15:00Z",
            status: DocumentStatus.ANALYZED,
            metadata: mockKMMetadata,
            folderId: "folder-km-proekt",
          },
          {
            id: "doc-km-uzly",
            name: "КМ-Узлы.pdf",
            type: DocumentType.PROJECT,
            uploadDate: "2024-12-21T09:00:00Z",
            status: DocumentStatus.PENDING,
            folderId: "folder-km-proekt",
          },
        ],
      },
      {
        id: "folder-km-templates",
        name: "Шаблоны ИД",
        sectionId: "section-km",
        documents: [
          {
            id: "doc-km-template",
            name: "Шаблон-КМ-Ведомость.xlsx",
            type: DocumentType.TEMPLATE,
            uploadDate: "2024-12-15T14:00:00Z",
            status: DocumentStatus.DRAFT,
            folderId: "folder-km-templates",
          },
        ],
      },
    ],
  };

  // КЖ Section
  const kzhSection: Section = {
    id: "section-kzh",
    name: "КЖ - Железобетонные конструкции",
    type: SectionType.KZH,
    projectId: "project-1",
    folders: [
      {
        id: "folder-kzh-proekt",
        name: "Проект",
        sectionId: "section-kzh",
        documents: [
          {
            id: "doc-kzh-ar",
            name: "КЖ-АР.pdf",
            type: DocumentType.PROJECT,
            uploadDate: "2024-12-22T13:45:00Z",
            status: DocumentStatus.DRAFT,
            folderId: "folder-kzh-proekt",
          },
        ],
      },
      {
        id: "folder-kzh-templates",
        name: "Шаблоны ИД",
        sectionId: "section-kzh",
        documents: [
          {
            id: "doc-kzh-template",
            name: "Шаблон-КЖ-Ведомость.xlsx",
            type: DocumentType.TEMPLATE,
            uploadDate: "2024-12-15T14:30:00Z",
            status: DocumentStatus.DRAFT,
            folderId: "folder-kzh-templates",
          },
        ],
      },
    ],
  };

  // Project
  const project: Project = {
    id: "project-1",
    name: "Складской комплекс",
    sections: [kmSection, kzhSection],
  };

  return project;
}

// Get all documents from project
export function getAllDocuments(project: Project): Map<string, Document> {
  const documentsMap = new Map<string, Document>();

  project.sections.forEach((section) => {
    section.folders.forEach((folder) => {
      folder.documents.forEach((doc) => {
        documentsMap.set(doc.id, doc);
      });
    });
  });

  return documentsMap;
}
