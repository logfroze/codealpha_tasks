export const PYTHON_SCRIPT_CODE = `#!/usr/bin/env python3
"""
CodeAlpha - Python - Task 03: Task Automation (JPG Image File Organizer)
Internship Task 03: Task Automation with Python Scripts

Description:
    Automates the process of moving all .jpg image files from a specified
    source folder into a separate destination folder using Python's built-in
    \`os\` and \`shutil\` modules.

Concepts Used:
    - os: Path checking, directory listing, path joining, directory creation
    - shutil: Moving files across directories
    - Conditional logic, loops, error handling, and user prompts
"""

import os
import shutil
import sys


def print_banner():
    """Prints a brief script header."""
    print("JPG File Organizer")
    print("Moves .jpg files from a source directory to a destination directory.\\n")


def get_folder_paths():
    """Prompts the user to enter the source and destination folder paths."""
    source_dir = input("Enter the source folder path: ").strip()
    dest_dir = input("Enter the destination folder path: ").strip()
    return source_dir, dest_dir


def validate_source(source_path):
    """
    Validates that the source directory exists and is a valid folder.
    Returns (True, "") if valid, or (False, error_message) if invalid.
    """
    if not source_path:
        return False, "Source folder path cannot be empty."

    if not os.path.exists(source_path):
        return False, f"Source folder does not exist: '{source_path}'"

    if not os.path.isdir(source_path):
        return False, f"Source path is a file, not a directory: '{source_path}'"

    return True, ""


def ensure_destination(dest_path):
    """
    Verifies destination folder. Automatically creates it if it doesn't exist.
    Returns (True, was_created) or (False, error_message).
    """
    if not dest_path:
        return False, "Destination folder path cannot be empty."

    try:
        if not os.path.exists(dest_path):
            os.makedirs(dest_path, exist_ok=True)
            return True, True
        elif not os.path.isdir(dest_path):
            return False, f"Destination path exists but is not a directory: '{dest_path}'"
        return True, False
    except OSError as error:
        return False, f"Failed to create destination folder: {error}"


def is_jpg_file(filename):
    """
    Checks whether a filename ends with a .jpg or .jpeg extension.
    Case-insensitive matching handles .jpg, .JPG, .Jpg, etc.
    """
    lower_name = filename.lower()
    return lower_name.endswith(".jpg") or lower_name.endswith(".jpeg")


def find_jpg_files(source_path):
    """
    Scans the source folder and returns a sorted list of .jpg filenames.
    Ignores subdirectories and other file extensions.
    """
    jpg_files = []
    try:
        entries = os.listdir(source_path)
    except OSError as error:
        print(f"[Error] Unable to read directory contents: {error}")
        return []

    for item in entries:
        full_path = os.path.join(source_path, item)
        # Verify it is a regular file (not a folder) and has a .jpg extension
        if os.path.isfile(full_path) and is_jpg_file(item):
            jpg_files.append(item)

    return sorted(jpg_files)


def move_files(source_path, dest_path, files):
    """
    Moves each file from source_path to dest_path using shutil.move.
    Safely handles duplicate destination filenames by skipping and reporting.
    Returns a tuple of (moved_count, skipped_count, failed_count).
    """
    moved_count = 0
    skipped_count = 0
    failed_count = 0

    print("-" * 55)
    print("Processing files:")
    print("-" * 55)

    for filename in files:
        src_file = os.path.join(source_path, filename)
        dest_file = os.path.join(dest_path, filename)

        # Duplicate check: avoid accidental overwrites
        if os.path.exists(dest_file):
            print(f"[skip]  {filename} (already exists in destination)")
            skipped_count += 1
            continue

        try:
            shutil.move(src_file, dest_file)
            print(f"[moved] {filename}")
            moved_count += 1
        except (shutil.Error, OSError) as error:
            print(f"[error] {filename}: {error}")
            failed_count += 1

    return moved_count, skipped_count, failed_count


def display_summary(source_path, dest_path, total_found, moved, skipped, failed):
    """Prints a concise summary of the operation."""
    print("\\nSummary:")
    print(f"  Source:       {os.path.abspath(source_path)}")
    print(f"  Destination:  {os.path.abspath(dest_path)}")
    print(f"  Total .jpg:   {total_found}")
    print(f"  Moved:        {moved}")
    print(f"  Skipped:      {skipped}")
    if failed > 0:
        print(f"  Failed:       {failed}")
    print()


def run_automation(source_path=None, dest_path=None):
    """
    Coordinates the task automation workflow.
    Accepts paths as arguments or prompts interactively.
    """
    print_banner()

    # If paths weren't provided via CLI arguments, prompt interactively
    if not source_path or not dest_path:
        prompt_source, prompt_dest = get_folder_paths()
        source_path = source_path or prompt_source
        dest_path = dest_path or prompt_dest

    # 1. Validate the source folder
    is_valid, error_msg = validate_source(source_path)
    if not is_valid:
        print(f"[Error] {error_msg}")
        return False

    # 2. Prevent same-folder movement
    try:
        if os.path.abspath(source_path) == os.path.abspath(dest_path):
            print("[Error] Source and destination folders cannot be the same.")
            return False
    except Exception:
        pass

    # 3. Ensure destination directory exists (auto-create if needed)
    is_dest_valid, dest_status = ensure_destination(dest_path)
    if not is_dest_valid:
        print(f"[Error] {dest_status}")
        return False
    elif dest_status is True:
        print(f"[Info] Created destination folder: '{dest_path}'")

    # 4. Find all .jpg files
    jpg_files = find_jpg_files(source_path)
    total_found = len(jpg_files)

    if total_found == 0:
        print(f"[Notice] No .jpg files found in '{source_path}'. Nothing to move.")
        display_summary(source_path, dest_path, 0, 0, 0, 0)
        return True

    print(f"Found {total_found} .jpg file(s) to process.\\n")

    # 5. Move files
    moved, skipped, failed = move_files(source_path, dest_path, jpg_files)

    # 6. Display final summary
    display_summary(source_path, dest_path, total_found, moved, skipped, failed)
    return True


if __name__ == "__main__":
    try:
        # Support command-line arguments: python jpg_organizer.py [source] [destination]
        if len(sys.argv) >= 3:
            run_automation(sys.argv[1], sys.argv[2])
        else:
            run_automation()
    except KeyboardInterrupt:
        print("\\n\\n[Aborted] Process cancelled by user.")
        sys.exit(1)
`;

export const README_CONTENT = `# JPG File Organizer

A Python automation script that moves \`.jpg\` files from a source directory into a destination directory using Python's standard library (\`os\` and \`shutil\`).

## Requirements
- Python 3.6+
- No external dependencies (uses standard library modules: \`os\`, \`shutil\`, \`sys\`)

## Features
- **Source Validation**: Verifies that the source path exists and is a directory.
- **Automatic Directory Creation**: Creates the destination directory if it does not already exist (\`os.makedirs\`).
- **Case-Insensitive Matching**: Matches \`.jpg\`, \`.JPG\`, and \`.jpeg\` extensions.
- **Directory and Non-Target Filtering**: Ignores subdirectories and leaves non-JPG files (\`.png\`, \`.pdf\`, \`.txt\`, etc.) untouched in the source directory.
- **Collision Avoidance**: Skips moving files if a file with the same name already exists in the destination to prevent overwrites.
- **Operation Summary**: Reports counts for files found, moved, skipped, and failed.

## Usage

### Interactive Mode
Run the script without arguments to be prompted for paths:
\`\`\`bash
python jpg_organizer.py
\`\`\`

### CLI Arguments
Provide source and destination directory paths as arguments:
\`\`\`bash
python jpg_organizer.py "/path/to/source" "/path/to/destination"
\`\`\`

## Running Tests
The test suite validates path handling, extension matching, duplicate collision safety, and directory filtering:
\`\`\`bash
python -m unittest test_jpg_organizer.py
\`\`\`
`;

export const TEST_SUITE_CODE = `#!/usr/bin/env python3
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
        self.test_root = tempfile.mkdtemp(prefix="codealpha_test_")
        self.source_dir = os.path.join(self.test_root, "source")
        self.dest_dir = os.path.join(self.test_root, "destination")
        os.makedirs(self.source_dir, exist_ok=True)

    def tearDown(self):
        shutil.rmtree(self.test_root, ignore_errors=True)

    def create_dummy_file(self, folder, filename, content="dummy data"):
        path = os.path.join(folder, filename)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return path

    def test_extension_detection_case_insensitivity(self):
        self.assertTrue(is_jpg_file("photo.jpg"))
        self.assertTrue(is_jpg_file("PHOTO.JPG"))
        self.assertTrue(is_jpg_file("image.Jpg"))
        self.assertTrue(is_jpg_file("banner.jpeg"))
        self.assertTrue(is_jpg_file("BANNER.JPEG"))
        self.assertFalse(is_jpg_file("doc.pdf"))
        self.assertFalse(is_jpg_file("icon.png"))
        self.assertFalse(is_jpg_file("notes.txt"))

    def test_find_jpg_files_ignores_other_types_and_directories(self):
        self.create_dummy_file(self.source_dir, "sample1.jpg")
        self.create_dummy_file(self.source_dir, "SAMPLE2.JPG")
        self.create_dummy_file(self.source_dir, "sample3.jpeg")
        self.create_dummy_file(self.source_dir, "doc.pdf")
        self.create_dummy_file(self.source_dir, "graphic.png")
        self.create_dummy_file(self.source_dir, "readme.txt")

        subfolder = os.path.join(self.source_dir, "nested_folder.jpg")
        os.makedirs(subfolder, exist_ok=True)

        found = find_jpg_files(self.source_dir)
        expected = ["SAMPLE2.JPG", "sample1.jpg", "sample3.jpeg"]
        self.assertEqual(sorted(found), sorted(expected))

    def test_full_move_automation(self):
        self.create_dummy_file(self.source_dir, "photo1.jpg", "content 1")
        self.create_dummy_file(self.source_dir, "PHOTO2.JPG", "content 2")
        self.create_dummy_file(self.source_dir, "notes.txt", "keep me")
        self.create_dummy_file(self.source_dir, "doc.pdf", "keep me too")

        self.assertFalse(os.path.exists(self.dest_dir))

        success = run_automation(self.source_dir, self.dest_dir)
        self.assertTrue(success)
        self.assertTrue(os.path.isdir(self.dest_dir))

        dest_files = os.listdir(self.dest_dir)
        self.assertIn("photo1.jpg", dest_files)
        self.assertIn("PHOTO2.JPG", dest_files)
        self.assertEqual(len(dest_files), 2)

        source_files = os.listdir(self.source_dir)
        self.assertNotIn("photo1.jpg", source_files)
        self.assertNotIn("PHOTO2.JPG", source_files)
        self.assertIn("notes.txt", source_files)
        self.assertIn("doc.pdf", source_files)

    def test_duplicate_file_handling(self):
        os.makedirs(self.dest_dir, exist_ok=True)
        self.create_dummy_file(self.dest_dir, "existing.jpg", "original content in dest")
        self.create_dummy_file(self.source_dir, "existing.jpg", "new content in source")
        self.create_dummy_file(self.source_dir, "new_image.jpg", "brand new image")

        success = run_automation(self.source_dir, self.dest_dir)
        self.assertTrue(success)

        with open(os.path.join(self.dest_dir, "existing.jpg"), "r") as f:
            self.assertEqual(f.read(), "original content in dest")

        self.assertTrue(os.path.exists(os.path.join(self.dest_dir, "new_image.jpg")))
        self.assertTrue(os.path.exists(os.path.join(self.source_dir, "existing.jpg")))

    def test_empty_source_folder(self):
        success = run_automation(self.source_dir, self.dest_dir)
        self.assertTrue(success)

    def test_nonexistent_source_folder(self):
        non_existent = os.path.join(self.test_root, "does_not_exist")
        valid, msg = validate_source(non_existent)
        self.assertFalse(valid)
        self.assertIn("not exist", msg.lower())

    def test_source_is_a_file_instead_of_directory(self):
        dummy_file = self.create_dummy_file(self.test_root, "not_a_folder.txt")
        valid, msg = validate_source(dummy_file)
        self.assertFalse(valid)
        self.assertIn("not a directory", msg.lower())


if __name__ == "__main__":
    unittest.main(verbosity=2)
`;
