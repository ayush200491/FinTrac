# Creating a React app using Webpack

Creating a React app using Webpack involves several steps, including setting up the project structure, installing dependencies, and configuring Webpack.

## Step-by-step guide to create a React app with Webpack

### Step 1: Set Up the Project Directory

1. **Create the project directory:**

   ```bash
   mkdir my-react-app
   cd my-react-app
   ```

2. **Initialize a new Node.js project:**

   ```bash
   npm init -y
   ```

### Step 2: Install Dependencies

1. **Install React and ReactDOM:**

   ```bash
   npm install react react-dom
   ```

2. **Install Webpack and Webpack CLI:**

   ```bash
   npm install --save-dev webpack webpack-cli
   ```

3. **Install Babel (to transpile JSX and ES6+ syntax):**

   ```bash
   npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader
   ```

4. **Install Webpack Dev Server (for development):**

   ```bash
   npm install --save-dev webpack-dev-server
   ```

5. **Install HTML Webpack Plugin (to generate an HTML file):**

   ```bash
   npm install --save-dev html-webpack-plugin
   ```

### Step 3: Configure Babel

1. **Create a `.babelrc` file in the root directory:**

   ```json
   {
     "presets": ["@babel/preset-env", "@babel/preset-react"]
   }
   ```

### Step 4: Configure Webpack

1. **Create a `webpack.config.js` file in the root directory:**

   ```javascript
   const path = require('path');
   const HtmlWebpackPlugin = require('html-webpack-plugin');

   module.exports = {
     entry: './src/index.js',
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bundle.js'
     },
     module: {
       rules: [
         {
           test: /\.jsx?$/,
           exclude: /node_modules/,
           use: {
             loader: 'babel-loader'
           }
         }
       ]
     },
     resolve: {
       extensions: ['.js', '.jsx']
     },
     plugins: [
       new HtmlWebpackPlugin({
         template: './src/index.html'
       })
     ],
     devServer: {
       contentBase: path.resolve(__dirname, 'dist'),
       compress: true,
       port: 9000
     }
   };
   ```

### Step 5: Create the Source Files

1. **Create the `src` and `public` directory:**

   ```bash
   mkdir src public
   ```

2. **Create the `index.html` file in the `src` directory:**

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>React App</title>
   </head>
   <body>
     <div id="root"></div>
   </body>
   </html>
   ```

3. **Create the `index.js` file in the `src` directory:**

   ```javascript
   import React from 'react';
   import ReactDOM from 'react-dom';

   const App = () => (
     <div>
       <h1>Hello, React!</h1>
     </div>
   );

   ReactDOM.render(<App />, document.getElementById('root'));
   ```

### Step 6: Add Scripts to `package.json`

1. **Open `package.json` and add the following scripts:**

   ```json
   "scripts": {
     "start": "webpack serve --mode development",
     "build": "webpack --mode production"
   }
   ```

### Step 7: Run the Application

1. **Start the development server:**

   ```bash
   npm start
   ```

2. **Build the application for production:**

   ```bash
   npm run build
   ```

This setup will give you a basic React application using Webpack. You can now start developing your React components, and Webpack will handle the bundling of your code.
