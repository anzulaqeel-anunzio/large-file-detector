// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel

/*
 * Developed for Anunzio International by Anzul Aqeel
 * Contact +971545822608 or +971585515742
 */

const core = require('@actions/core');
const github = require('@actions/github');
const minimatch = require('minimatch');

async function run() {
    try {
        const token = core.getInput('token');
        const maxSizeMB = parseFloat(core.getInput('max_size_mb')) || 1;
        const failOnError = core.getInput('fail_on_error') === 'true';
        const ignorePatterns = core.getInput('ignore_patterns').split(',').map(p => p.trim()).filter(p => p.length > 0);

        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        console.log(`Max size: ${maxSizeMB} MB (${maxSizeBytes} bytes)`);

        const octokit = github.getOctokit(token);
        const { owner, repo, number } = github.context.issue;

        if (!number) {
            console.log('Not a PR. Skipping.');
            return;
        }

        // We need to fetch files and this time, check their size status (blob) or see if PR listing gives size?
        // PR listFiles endpoint does NOT return file size directly in all API versions or contexts easily.
        // Actually, 'additions/deletions/changes' is diff lines.
        // To get file size, we might need to query the blob or tree.

        // However, listFiles DOES return `status`. It does not return `size` directly in bytes reliably for the *new* file.
        // But we can get the sha, then get the blob.

        const { data: files } = await octokit.rest.pulls.listFiles({
            owner,
            repo,
            pull_number: number,
            per_page: 100
        });

        let largeFilesFound = false;

        for (const file of files) {
            if (file.status === 'removed') continue;

            // Check ignores
            let ignored = false;
            for (const p of ignorePatterns) {
                if (minimatch(file.filename, p)) {
                    ignored = true;
                    break;
                }
            }
            if (ignored) continue;

            // Fetch blob details to get size
            const { data: blob } = await octokit.rest.git.getBlob({
                owner,
                repo,
                file_sha: file.sha
            });

            const size = blob.size;

            if (size > maxSizeBytes) {
                const sizeMB = (size / (1024 * 1024)).toFixed(2);
                console.error(`  [FAIL] ${file.filename} is too large: ${sizeMB} MB`);
                largeFilesFound = true;
            }
        }

        if (largeFilesFound) {
            const msg = 'One or more files exceed the size limit.';
            if (failOnError) {
                core.setFailed(msg);
            } else {
                console.warn(msg);
            }
        } else {
            console.log('All files within size limits.');
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();

// Developed for Anunzio International by Anzul Aqeel. Contact +971545822608 or +971585515742. Linkedin Profile: linkedin.com/in/anzulaqeel
