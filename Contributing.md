# How to Contribute

**We welcome contributions from the community to help improve and enhance our Solidity smart contract project. Here are the steps to get started:**

# Getting Started
To get involved in this project, follow these simple steps: 

1) **Fork this Repository:** Click the "Fork" button on the top right of this repository to create your copy.

2) **Clone Your Fork:** Clone your forked repository to your local development environment. Open your terminal and run the following commands:

```bash
    git clone https://github.com/your-username/solidity-hacktoberfest-2023.git
    cd solidity-hacktoberfest-2023 
```

3) **Create a New Branch:** Create a new branch for your changes. Name it something related to the feature or fix you plan to work on.

```javascript
    git checkout -b feature-name

    mkdir contract-name //make your contract directory
    cd contract-name

```

4) **Initialize Hardhat**
Initialize Hardhat: Set up Hardhat for your project by running the following commands:

```javascript
npm install --save-dev hardhat 
npx hardhat

```

5) **Write Solidity Smart Contract** 
 
**Create New Contracts:** Create a new solidity smart contract. Make sure to follow best practices, include relevant comments, and write test cases.
 
**Enhance Existing Contracts:** If you come across an existing contract that can be improved, consider enhancing it by creating a new version. Ensure backward compatibility and document the changes.

**Documentation:** Create clear and concise documentation for each smart contract. Good documentation helps other developers understand how to use the contract. Create  README.md file.

**Testing:** Ensure that your smart contract passes all relevant tests. Write comprehensive test cases to cover different scenarios.

```javascript
npx hardhat compile // Compile the smart contract
npx hardhat test // Test the smart contract
npx hardhat run scripts/deploy.js // deploy smart contract
```

6) **Create .gitignore file inside contract dir**
```javascript
//add this into ignore file
node_modules
.env
coverage
coverage.json
typechain
typechain-types

# Hardhat files
cache
artifacts 

```

7) **Commit Your Changes:** Once your changes are ready, commit them with a descriptive message.
```javascript
    git add .
    git commit -m "Add feature XYZ" (replace with a meaningful commit message)

```
 
8) **Push Your Changes:** Push your changes to your fork on GitHub.
```javascript
    git push origin feature-name 

```

9) **Create a Pull Request (PR):** Go to your fork on GitHub, and you will see a button to create a pull request. Provide a clear description of your changes in the PR.

10) **Review and Collaborate:** Collaborate with others on your PR. Make any necessary updates based on feedback.

11) **Celebrate:** Congratulations! You've made a valuable contribution to this open-source project during Hacktoberfest 2023. 
