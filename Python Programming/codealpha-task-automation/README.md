# JPG File Organizer

A Python automation script that moves `.jpg` files from a source directory into a destination directory using Python's standard library (`os` and `shutil`).

## Requirements

- Python 3.6+
- No external dependencies (uses standard library modules: `os`, `shutil`, `sys`)

## Features

- **Source Validation**: Verifies that the source path exists and is a directory.
- **Automatic Directory Creation**: Creates the destination directory if it does not already exist (`os.makedirs`).
- **Case-Insensitive Matching**: Matches `.jpg`, `.JPG`, and `.jpeg` extensions.
- **Directory and Non-Target Filtering**: Ignores subdirectories and leaves non-JPG files (`.png`, `.pdf`, `.txt`, etc.) untouched in the source directory.
- **Collision Avoidance**: Skips moving files if a file with the same name already exists in the destination to prevent overwrites.
- **Operation Summary**: Reports counts for files found, moved, skipped, and failed.

## Usage

### Interactive Mode

Run the script without arguments to be prompted for paths:

```bash
python jpg_organizer.py
```

Prompts:
```text
Enter the source folder path: /path/to/source
Enter the destination folder path: /path/to/destination
```

### CLI Arguments

Provide source and destination directory paths as arguments:

```bash
python jpg_organizer.py "/path/to/source" "/path/to/destination"
```

### Example Output

```text
JPG File Organizer
Moves .jpg files from a source directory to a destination directory.

Found 3 .jpg file(s) to process.

[moved] photo_01.jpg
[moved] photo_02.JPG
[skip]  existing_banner.jpg (already exists in destination)

Summary:
  Source:       /home/user/Downloads
  Destination:  /home/user/Pictures/Organized
  Total .jpg:   3
  Moved:        2
  Skipped:      1
```

## Running Tests

The test suite validates path handling, extension matching, duplicate collision safety, and directory filtering using isolated temporary directories (`tempfile`):

```bash
python -m unittest test_jpg_organizer.py
```

## Project Structure

```text
.
├── jpg_organizer.py       # Main automation script
├── test_jpg_organizer.py  # Unit test suite (7 test cases)
└── README.md              # Documentation
```
