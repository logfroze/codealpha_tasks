#!/usr/bin/env python3
"""
Test Suite for jpg_organizer.py
Verifies all functionality required for CodeAlpha Internship Task 3:
    1. Only .jpg / .jpeg files are selected
    2. Matching is case-insensitive (.jpg, .JPG, .Jpg)
    3. Non-jpg files (.png, .pdf, .txt) remain untouched in source
    4. Subdirectories are ignored
    5. Files are actually moved (not copied)
    6. Destination directory is auto-created if missing
    7. Existing destination files are handled safely (duplicate prevention)
    8. Missing or invalid source folders fail gracefully
    9. Empty folders are handled gracefully
"""

import os
import shutil
import tempfile
import unittest

# Import functions under test from jpg_organizer
from jpg_organizer import (
    validate_source,
    ensure_destination,
    is_jpg_file,
    find_jpg_files,
    move_files,
    run_automation,
)


class TestJpgOrganizer(unittest.TestCase):
    def setUp(self):
        # Create a fresh temporary directory for each test
        self.test_root = tempfile.mkdtemp(prefix="codealpha_test_")
        self.source_dir = os.path.join(self.test_root, "source")
        self.dest_dir = os.path.join(self.test_root, "destination")
        os.makedirs(self.source_dir, exist_ok=True)

    def tearDown(self):
        # Cleanup temporary files
        shutil.rmtree(self.test_root, ignore_errors=True)

    def create_dummy_file(self, folder, filename, content="dummy data"):
        path = os.path.join(folder, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return path

    def test_extension_detection_case_insensitivity(self):
        """Verify is_jpg_file detects various cases and formats."""
        self.assertTrue(is_jpg_file("photo.jpg"))
        self.assertTrue(is_jpg_file("PHOTO.JPG"))
        self.assertTrue(is_jpg_file("image.Jpg"))
        self.assertTrue(is_jpg_file("banner.jpeg"))
        self.assertTrue(is_jpg_file("BANNER.JPEG"))
        self.assertFalse(is_jpg_file("doc.pdf"))
        self.assertFalse(is_jpg_file("icon.png"))
        self.assertFalse(is_jpg_file("notes.txt"))
        self.assertFalse(is_jpg_file("jpg_without_dot"))

    def test_find_jpg_files_ignores_other_types_and_directories(self):
        """Verify find_jpg_files only picks .jpg files and ignores subfolders."""
        # Create JPG files
        self.create_dummy_file(self.source_dir, "sample1.jpg")
        self.create_dummy_file(self.source_dir, "SAMPLE2.JPG")
        self.create_dummy_file(self.source_dir, "sample3.jpeg")

        # Create non-JPG files
        self.create_dummy_file(self.source_dir, "doc.pdf")
        self.create_dummy_file(self.source_dir, "graphic.png")
        self.create_dummy_file(self.source_dir, "readme.txt")

        # Create a subfolder with .jpg in it (should NOT be processed recursively)
        subfolder = os.path.join(self.source_dir, "nested_folder.jpg")
        os.makedirs(subfolder, exist_ok=True)

        found = find_jpg_files(self.source_dir)

        # Should find only the 3 top-level images
        expected = ["SAMPLE2.JPG", "sample1.jpg", "sample3.jpeg"]
        self.assertEqual(sorted(found), sorted(expected))

    def test_full_move_automation(self):
        """Verify files are moved, destination is created, non-JPGs stay behind."""
        self.create_dummy_file(self.source_dir, "photo1.jpg", "content 1")
        self.create_dummy_file(self.source_dir, "PHOTO2.JPG", "content 2")
        self.create_dummy_file(self.source_dir, "notes.txt", "keep me")
        self.create_dummy_file(self.source_dir, "doc.pdf", "keep me too")

        # Destination does not exist yet
        self.assertFalse(os.path.exists(self.dest_dir))

        success = run_automation(self.source_dir, self.dest_dir)
        self.assertTrue(success)

        # Destination should now exist
        self.assertTrue(os.path.isdir(self.dest_dir))

        # Destination should contain the JPGs
        dest_files = os.listdir(self.dest_dir)
        self.assertIn("photo1.jpg", dest_files)
        self.assertIn("PHOTO2.JPG", dest_files)
        self.assertEqual(len(dest_files), 2)

        # Source should NO LONGER contain the JPGs (moved, not copied)
        source_files = os.listdir(self.source_dir)
        self.assertNotIn("photo1.jpg", source_files)
        self.assertNotIn("PHOTO2.JPG", source_files)

        # Source MUST still have the non-JPG files
        self.assertIn("notes.txt", source_files)
        self.assertIn("doc.pdf", source_files)

    def test_duplicate_file_handling(self):
        """Verify conflicting files in destination are skipped safely without overwrite."""
        os.makedirs(self.dest_dir, exist_ok=True)

        # Create pre-existing file in destination
        self.create_dummy_file(self.dest_dir, "existing.jpg", "original content in dest")

        # Create same-name file and a new file in source
        self.create_dummy_file(self.source_dir, "existing.jpg", "new content in source")
        self.create_dummy_file(self.source_dir, "new_image.jpg", "brand new image")

        success = run_automation(self.source_dir, self.dest_dir)
        self.assertTrue(success)

        # Destination pre-existing file was NOT overwritten
        with open(os.path.join(self.dest_dir, "existing.jpg"), "r") as f:
            self.assertEqual(f.read(), "original content in dest")

        # Destination got the new image
        self.assertTrue(os.path.exists(os.path.join(self.dest_dir, "new_image.jpg")))

        # Source still retains the conflicting file that was skipped
        self.assertTrue(os.path.exists(os.path.join(self.source_dir, "existing.jpg")))

    def test_empty_source_folder(self):
        """Verify empty source folder is handled gracefully without errors."""
        success = run_automation(self.source_dir, self.dest_dir)
        self.assertTrue(success)

    def test_nonexistent_source_folder(self):
        """Verify non-existent source directory fails safely with clear error."""
        non_existent = os.path.join(self.test_root, "does_not_exist")
        valid, msg = validate_source(non_existent)
        self.assertFalse(valid)
        self.assertIn("not exist", msg.lower())

    def test_source_is_a_file_instead_of_directory(self):
        """Verify file path passed as source is rejected."""
        dummy_file = self.create_dummy_file(self.test_root, "not_a_folder.txt")
        valid, msg = validate_source(dummy_file)
        self.assertFalse(valid)
        self.assertIn("not a directory", msg.lower())


if __name__ == "__main__":
    print("Running CodeAlpha Task Automation Test Suite...\n")
    unittest.main(verbosity=2)
