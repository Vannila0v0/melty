// import * as assert from 'assert';
// import { PseudoCommit } from '../backend/pseudoCommits';
// import * as pseudoCommits from '../backend/pseudoCommits';
// import { SearchReplace, testExports } from '../backend/diffApplicator';

// suite('testExports.findSearchReplaceBlocks', () => {
//     test('should find original update blocks', () => {
//         const edit = `
// Here's the change:

// foo.txt
// \`\`\`text
// <<<<<<< SEARCH
// Two
// =======
// Tooooo
// >>>>>>> REPLACE
// \`\`\`

// Hope you like it!
// `;

//         const edits =testExports.findSearchReplaceBlocks(edit);
//         assert.deepStrictEqual(edits, [{ filePath: "foo.txt", search: "Two\n", replace: "Tooooo\n" }]);
//     });


//     // test('should handle filename below quote', () => {
//     //     const edit = `
//     // Here's the change:

//     // \`\`\`text
//     // foo.txt
//     // <<<<<<< SEARCH
//     // Two
//     // =======
//     // Tooooo
//     // >>>>>>> REPLACE
//     // \`\`\`

//     // Hope you like it!
//     // `;

//     //     const edits = Array.from(findOriginalUpdateBlocks(edit));
//     //     assert.deepStrictEqual(edits, [{ filePath: "foo.txt", search: "Two\n", replace: "Tooooo\n" }]);
//     // });

//     test('should throw error for unclosed block', () => {
//         const edit = `
// Here's the change:

// \`\`\`text
// foo.txt
// <<<<<<< SEARCH
// Two
// =======
// Tooooo


// oops!
// `;

//         assert.throws(() => {
//             testExports.findSearchReplaceBlocks(edit);
//         }, /Incomplete/);
//     });

//     test('should throw error for missing filename', () => {
//         const edit = `
// Here's the change:

// \`\`\`text
// <<<<<<< SEARCH
// Two
// =======
// Tooooo
// >>>>>>> REPLACE

// oops!
// `;

//         assert.throws(() => {
//             testExports.findSearchReplaceBlocks(edit);
//         }, /filename/);
//     });

//     test('should handle blocks with no final newline', () => {
//         const edit = `
// aider/coder.py
// <<<<<<< SEARCH
//             self.console.print("[red]^C again to quit")
// =======
//             self.io.tool_error("^C again to quit")
// >>>>>>> REPLACE

// aider/coder.py
// <<<<<<< SEARCH
//             self.io.tool_error("Malformed ORIGINAL/UPDATE blocks, retrying...")
//             self.io.tool_error(err)
// =======
//             self.io.tool_error("Malformed ORIGINAL/UPDATE blocks, retrying...")
//             self.io.tool_error(str(err))
// >>>>>>> REPLACE

// aider/coder.py
// <<<<<<< SEARCH
//             self.console.print("[red]Unable to get commit message from gpt-3.5-turbo. Use /commit to try again.\\n")
// =======
//             self.io.tool_error("Unable to get commit message from gpt-3.5-turbo. Use /commit to try again.")
// >>>>>>> REPLACE

// aider/coder.py
// <<<<<<< SEARCH
//             self.console.print("[red]Skipped commmit.")
// =======
//             self.io.tool_error("Skipped commmit.")
// >>>>>>> REPLACE`;

//         // Should not throw an error
//         assert.doesNotThrow(() => {
//             testExports.findSearchReplaceBlocks(edit);
//         });
//     });

//     test('should handle missing filename on second block', () => {
//         const edit = `
// No problem! Here are the changes to patch \`subprocess.check_output\` instead of \`subprocess.run\` in both tests:

// \`\`\`python
// tests/test_repomap.py
// <<<<<<< SEARCH
//     def test_check_for_ctags_failure(self):
//         with patch("subprocess.run") as mock_run:
//             mock_run.side_effect = Exception("ctags not found")
// =======
//     def test_check_for_ctags_failure(self):
//         with patch("subprocess.check_output") as mock_check_output:
//             mock_check_output.side_effect = Exception("ctags not found")
// >>>>>>> REPLACE

// <<<<<<< SEARCH
//     def test_check_for_ctags_success(self):
//         with patch("subprocess.run") as mock_run:
//             mock_run.return_value = CompletedProcess(args=["ctags", "--version"], returncode=0, stdout='''{
//   "_type": "tag",
//   "name": "status",
//   "path": "aider/main.py",
//   "pattern": "/^    status = main()$/",
//   "kind": "variable"
// }''')
// =======
//     def test_check_for_ctags_success(self):
//         with patch("subprocess.check_output") as mock_check_output:
//             mock_check_output.return_value = '''{
//   "_type": "tag",
//   "name": "status",
//   "path": "aider/main.py",
//   "pattern": "/^    status = main()$/",
//   "kind": "variable"
// }'''
// >>>>>>> REPLACE
// \`\`\`

// These changes replace the \`subprocess.run\` patches with \`subprocess.check_output\` patches in both \`test_check_for_ctags_failure\` and \`test_check_for_ctags_success\` tests.
// `;
//         const editBlocks = testExports.findSearchReplaceBlocks(edit);
//         assert.strictEqual(editBlocks.length, 2);  // 2 edits
//         assert.strictEqual(editBlocks[0].filePath, "tests/test_repomap.py");
//         assert.strictEqual(editBlocks[1].filePath, "tests/test_repomap.py");
//     });
// });

// suite('applySearchReplace', () => {
//     test('should apply search and replace correctly', () => {
//         const initialState: PseudoCommit = pseudoCommits.create({
//             'test.txt': 'Hello, world!\nThis is a test.'
//         }, undefined, "");
//         const searchReplace: SearchReplace = {
//             filePath: 'test.txt',
//             search: 'world',
//             replace: 'universe'
//         };

//         const newState = testExports.applySearchReplace(initialState, searchReplace);

//         assert.strictEqual(pseudoCommits.getFileContents(newState, 'test.txt'), 'Hello, universe!\nThis is a test.');
//     });

//     test('should throw error if search text not found', () => {
//         const initialState: PseudoCommit = pseudoCommits.create({
//             'test.txt': meltyFiles.create('test.txt', 'Hello, world!')
//         }, undefined, "");
//         const searchReplace: SearchReplace = {
//             filePath: 'test.txt',
//             search: 'universe',
//             replace: 'world'
//         };

//         assert.throws(() => {
//             testExports.applySearchReplace(initialState, searchReplace);
//         }, /Search text not found in test.txt/);
//     });

//     test('should create new file if it doesn\'t exist', () => {
//         const initialState: PseudoCommit = pseudoCommits.create({}, undefined, "");
//         const searchReplace: SearchReplace = {
//             filePath: 'new.txt',
//             search: '',
//             replace: 'New content'
//         };

//         const newState = testExports.applySearchReplace(initialState, searchReplace);

//         assert.strictEqual(pseudoCommits.getFileContents(newState, 'new.txt'), 'New content');
//     });
// });