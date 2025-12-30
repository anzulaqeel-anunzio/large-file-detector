# Large File Detector

Prevent bloat in your repository! This GitHub Action warns or fails builds when large files are detected in Pull Requests.

## Features

-   **Size Thresholds**: Configurable max file size (e.g., 5MB).
-   **Warnings or Errors**: Choose whether to warn or fail the build.
-   **Ignore Paths**: Exclude specific directories (like `assets/`).

## Usage

Create a workflow file (e.g., `.github/workflows/large-files.yml`):

```yaml
name: Check File Sizes
on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Large File Detector
        uses: ./
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          max_size_mb: '10'
          fail_on_error: 'true'
          ignore_patterns: '*.png,assets/**'
```

## Inputs

| Input | Description | Default |
| :--- | :--- | :--- |
| `token` | GITHUB_TOKEN | `${{ github.token }}` |
| `max_size_mb` | Max file size in megabytes | `1` |
| `fail_on_error` | Fail build if large file found? | `true` |
| `ignore_patterns` | Glob patterns to ignore | `` |

## Contact

Developed for Anunzio International by Anzul Aqeel.
Contact +971545822608 or +971585515742.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---
### 🔗 Part of the "Ultimate Utility Toolkit"
This tool is part of the **[Anunzio International Utility Toolkit](https://github.com/anzulaqeel-anunzio/ultimate-utility-toolkit)**.
Check out the full collection of **180+ developer tools, scripts, and templates** in the master repository.

Developed for Anunzio International by Anzul Aqeel.
