-- SYNAPSE Development Seed Data
-- Migration: Insert sample data for development and testing
-- Created: 2024-12-25
-- Purpose: Provide realistic test data for frontend development
-- WARNING: Only run in development environment, NOT in production

-- ============================================================================
-- IMPORTANT: Development Environment Only
-- ============================================================================
-- This script should only be executed in development/staging environments
-- It creates test data with a specific test user ID
-- Replace 'TEST_USER_ID' with an actual user UUID from your Supabase Auth
-- ============================================================================

-- Note: Before running this script, create a test user in Supabase Auth dashboard
-- Then replace the placeholder below with the actual user UUID

-- ============================================================================
-- PART 1: SAMPLE PROJECT DATA
-- ============================================================================

-- Insert sample project
-- Replace '00000000-0000-0000-0000-000000000000' with actual test user UUID from auth.users
INSERT INTO projects (id, user_id, name, address, client) VALUES
    (
        'a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a',
        'd0b2f38d-457f-4c18-8ff1-92b4232d6fce', -- REPLACE WITH TEST USER ID
        'Складской комплекс',
        'Московская область, г. Подольск, Промзона Север',
        'ООО "СтройМонтаж"'
    );

-- ============================================================================
-- PART 2: SAMPLE SECTIONS DATA
-- ============================================================================

-- Insert КМ (Metal Structures) section
INSERT INTO sections (id, project_id, name, code) VALUES
    (
        'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
        'a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a',
        'Металлические конструкции',
        'КМ'
    );

-- Insert КЖ (Reinforced Concrete) section
INSERT INTO sections (id, project_id, name, code) VALUES
    (
        'c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f',
        'a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a',
        'Железобетонные конструкции',
        'КЖ'
    );

-- ============================================================================
-- PART 3: SAMPLE DOCUMENTS DATA
-- ============================================================================

-- КМ Section Documents
INSERT INTO documents (id, section_id, name, storage_path, status, type) VALUES
    (
        'd3e4f5a6-b7c8-4d9e-0f1a-2b3c4d5e6f7a',
        'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
        'КМ-АР.pdf',
        'a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a/КМ/1735123456_КМ-АР.pdf',
        'completed',
        'design'
    ),
    (
        'e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7a8b',
        'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
        'КМ-Ведомость.xlsx',
        'a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a/КМ/1735123789_КМ-Ведомость.xlsx',
        'completed',
        'design'
    ),
    (
        'f5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7a8b9c',
        'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
        'КМ-Узлы.pdf',
        'a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a/КМ/1735124000_КМ-Узлы.pdf',
        'processing',
        'design'
    ),
    (
        'a6b7c8d9-e0f1-4a2b-3c4d-5e6f7a8b9c0d',
        'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
        'Шаблон-КМ-Ведомость.xlsx',
        NULL,
        'uploaded',
        'executive'
    );

-- КЖ Section Documents
INSERT INTO documents (id, section_id, name, storage_path, status, type) VALUES
    (
        'b7c8d9e0-f1a2-4b3c-4d5e-6f7a8b9c0d1e',
        'c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f',
        'КЖ-АР.pdf',
        'a7f3e2c1-4b5a-4d6e-8f9a-0b1c2d3e4f5a/КЖ/1735125000_КЖ-АР.pdf',
        'uploaded',
        'design'
    ),
    (
        'c8d9e0f1-a2b3-4c4d-5e6f-7a8b9c0d1e2f',
        'c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f',
        'Шаблон-КЖ-Ведомость.xlsx',
        NULL,
        'uploaded',
        'executive'
    );

-- ============================================================================
-- PART 4: SAMPLE EXTRACTED DATA
-- ============================================================================

-- Extracted data for КМ-АР.pdf
INSERT INTO extracted_data (id, document_id, data, confidence_score) VALUES
    (
        'd9e0f1a2-b3c4-4d5e-6f7a-8b9c0d1e2f3a',
        'd3e4f5a6-b7c8-4d9e-0f1a-2b3c4d5e6f7a',
        '{
            "customer": "ООО \"СтройМонтаж\"",
            "projectObject": "Складской комплекс",
            "address": "Московская область, г. Подольск, Промзона Север",
            "axes": [
                {"direction": "horizontal", "label": "А", "position": 0},
                {"direction": "horizontal", "label": "Б", "position": 6000},
                {"direction": "horizontal", "label": "В", "position": 12000},
                {"direction": "horizontal", "label": "Г", "position": 18000},
                {"direction": "horizontal", "label": "Д", "position": 24000},
                {"direction": "vertical", "label": "1", "position": 0},
                {"direction": "vertical", "label": "2", "position": 6000},
                {"direction": "vertical", "label": "3", "position": 12000},
                {"direction": "vertical", "label": "4", "position": 18000},
                {"direction": "vertical", "label": "5", "position": 24000},
                {"direction": "vertical", "label": "6", "position": 30000},
                {"direction": "vertical", "label": "7", "position": 36000},
                {"direction": "vertical", "label": "8", "position": 42000}
            ],
            "elevationMarks": [0.000, 3.600, 7.200, 10.800],
            "billOfMaterials": [
                {
                    "position": "1",
                    "name": "Балка двутавровая 20Б1",
                    "weight": 45.5,
                    "quantity": 12,
                    "totalWeight": 546.0
                },
                {
                    "position": "2",
                    "name": "Колонна двутавровая 30Б1",
                    "weight": 68.2,
                    "quantity": 8,
                    "totalWeight": 545.6
                },
                {
                    "position": "3",
                    "name": "Связи из уголка 75x75x6",
                    "weight": 6.8,
                    "quantity": 24,
                    "totalWeight": 163.2
                },
                {
                    "position": "4",
                    "name": "Прогоны из швеллера 16П",
                    "weight": 14.2,
                    "quantity": 36,
                    "totalWeight": 511.2
                }
            ]
        }'::jsonb,
        0.92
    );

-- Extracted data for КМ-Ведомость.xlsx
INSERT INTO extracted_data (id, document_id, data, confidence_score) VALUES
    (
        'e0f1a2b3-c4d5-4e6f-7a8b-9c0d1e2f3a4b',
        'e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7a8b',
        '{
            "customer": "ООО \"СтройМонтаж\"",
            "projectObject": "Складской комплекс",
            "address": "Московская область, г. Подольск, Промзона Север",
            "axes": [
                {"direction": "horizontal", "label": "А", "position": 0},
                {"direction": "horizontal", "label": "Б", "position": 6000},
                {"direction": "horizontal", "label": "В", "position": 12000},
                {"direction": "horizontal", "label": "Г", "position": 18000},
                {"direction": "horizontal", "label": "Д", "position": 24000},
                {"direction": "vertical", "label": "1", "position": 0},
                {"direction": "vertical", "label": "2", "position": 6000},
                {"direction": "vertical", "label": "3", "position": 12000},
                {"direction": "vertical", "label": "4", "position": 18000},
                {"direction": "vertical", "label": "5", "position": 24000},
                {"direction": "vertical", "label": "6", "position": 30000},
                {"direction": "vertical", "label": "7", "position": 36000},
                {"direction": "vertical", "label": "8", "position": 42000}
            ],
            "elevationMarks": [0.000, 3.600, 7.200, 10.800],
            "billOfMaterials": [
                {
                    "position": "1",
                    "name": "Балка двутавровая 20Б1",
                    "weight": 45.5,
                    "quantity": 12,
                    "totalWeight": 546.0
                },
                {
                    "position": "2",
                    "name": "Колонна двутавровая 30Б1",
                    "weight": 68.2,
                    "quantity": 8,
                    "totalWeight": 545.6
                },
                {
                    "position": "3",
                    "name": "Связи из уголка 75x75x6",
                    "weight": 6.8,
                    "quantity": 24,
                    "totalWeight": 163.2
                },
                {
                    "position": "4",
                    "name": "Прогоны из швеллера 16П",
                    "weight": 14.2,
                    "quantity": 36,
                    "totalWeight": 511.2
                },
                {
                    "position": "5",
                    "name": "Ферма легкая 18м",
                    "weight": 124.5,
                    "quantity": 6,
                    "totalWeight": 747.0
                },
                {
                    "position": "6",
                    "name": "Опорные плиты 400x400x20",
                    "weight": 25.1,
                    "quantity": 16,
                    "totalWeight": 401.6
                }
            ]
        }'::jsonb,
        0.95
    );

-- ============================================================================
-- SEED DATA COMPLETE
-- ============================================================================
-- Data summary:
-- - 1 project: "Складской комплекс"
-- - 2 sections: КМ (Metal Structures), КЖ (Reinforced Concrete)
-- - 6 documents: 4 in КМ section, 2 in КЖ section
-- - 2 extracted data records with realistic engineering metadata
--
-- Next steps:
-- 1. Replace TEST_USER_ID placeholder with actual user UUID from auth.users
-- 2. Run this migration only in development environment
-- 3. Upload corresponding files to Supabase Storage buckets for complete testing
-- ============================================================================
