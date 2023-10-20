import simpleGit from 'simple-git';
import inquirer from 'inquirer';
const git = simpleGit();

async function listBranches() {
  try {
    const branches = await git.branch();
    console.log('Branches:');
    branches.all.forEach((branch) => console.log(branch));
  } catch (error) {
    console.error('Error:', error);
  }
}
async function createBranch() {
    const { branchName } = await inquirer.prompt({
        type: 'input',
        name: 'branchName',
        message: 'Enter the name for the new branch:',
      });
    
      try {
        await git.checkoutLocalBranch(branchName);
        console.log(`Branch "${branchName}" created and checked out.`);
      } catch (error) {
        console.error('Error:', error);
      }
}
async function pushBranch(){
  try {
    await git.init();

    const { excludeFiles } = await inquirer.prompt({
      type: 'input',
      name: 'excludeFiles',
      message: 'Enter file(s) to exclude from the push (comma-separated, or leave empty):',
    });

    
    if (excludeFiles) {
      const filesToExclude = excludeFiles.split(',').map(file => file.trim());
      const allFiles = await git.status();
      const filesToInclude = allFiles.files.filter(file => !filesToExclude.includes(file));
      await git.add(filesToInclude);
    } else {
      await git.add('.');
    }

    const { commitMessage } = await inquirer.prompt({
      type: 'input',
      name: 'commitMessage',
      message: 'Enter a commit message:',
    });

    await git.commit(commitMessage);

    const { remoteUrl } = await inquirer.prompt({
      type: 'input',
      name: 'remoteUrl',
      message: 'Enter the remote repository URL (e.g., GitHub):',
    });

    const { branchName } = await inquirer.prompt({
      type: 'input',
      name: 'branchName',
      message: 'Enter the branch to push (e.g., main):',
    });

    await git.addRemote('origin', remoteUrl);
    await git.push('origin', branchName);

    console.log('Initialized, added, committed, and pushed to the remote repository successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
}
async function switchBranch(){
    const { branchName } = await inquirer.prompt({
        type: 'input',
        name: 'branchName',
        message: 'Enter the name of the branch you want to switch: ',
    });
    
    try {
        await git.checkout(branchName);
        console.log(`Switche to branch "${branchName}"`);
    } catch (error) {
        console.error('Error:', error);
    }
}


async function main() {
  const choices = ['List Branches', 'Create Branch', 'Switch Branch' ,'Push Your Code', 'Quit'];
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices,
  });

  switch (action) {
    case 'List Branches':
      await listBranches();
      break;
    case 'Create Branch':
      await createBranch();
      break;
    case 'Switch Branch':
        await switchBranch();
        break;
    case 'Push Your Code':
        await pushBranch();
    case 'Quit':
      console.log('Goodbye!');
      break;
  }
}

main();
