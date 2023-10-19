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

async function main() {
  const choices = ['List Branches', 'Quit'];
  const { action } = await inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices,
  });

  if (action === 'List Branches') {
    await listBranches();
  }
}

main();
