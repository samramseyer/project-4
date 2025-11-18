const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Category = require('./models/Category');
const Question = require('./models/Question');
const Answer = require('./models/Answer');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Sample data
const categories = [
  {
    name: 'JavaScript',
    description: 'Questions about JavaScript, ES6+, and modern JS features',
    color: '#f7df1e',
    icon: '📜'
  },
  {
    name: 'Python',
    description: 'Python programming, Django, Flask, and data science',
    color: '#3776ab',
    icon: '🐍'
  },
  {
    name: 'React',
    description: 'React.js, hooks, state management, and components',
    color: '#61dafb',
    icon: '⚛️'
  },
  {
    name: 'Database',
    description: 'SQL, MongoDB, PostgreSQL, and database design',
    color: '#47a248',
    icon: '🗄️'
  },
  {
    name: 'Node.js',
    description: 'Node.js, Express, and backend development',
    color: '#68a063',
    icon: '🟢'
  }
];

const users = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    reputation: 150
  },
  {
    username: 'janedoe',
    email: 'jane@example.com',
    password: 'password123',
    reputation: 200
  },
  {
    username: 'techguru',
    email: 'guru@example.com',
    password: 'password123',
    reputation: 500
  }
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Question.deleteMany();
    await Answer.deleteMany();

    console.log('Data Destroyed...'.red.inverse);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories Imported...'.green.inverse);

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log('Users Imported...'.green.inverse);

    // Sample questions
    const questions = [
      {
        title: 'How do I use async/await in JavaScript?',
        body: 'I am new to JavaScript and I want to understand how async/await works. Can someone explain with examples?',
        category: createdCategories[0]._id, // JavaScript
        author: createdUsers[0]._id,
        tags: ['async', 'await', 'promises'],
        views: 45,
        upvotes: [createdUsers[1]._id, createdUsers[2]._id],
        downvotes: []
      },
      {
        title: 'What is the difference between let, const, and var?',
        body: 'Can someone explain the differences between let, const, and var in JavaScript? When should I use each one?',
        category: createdCategories[0]._id, // JavaScript
        author: createdUsers[1]._id,
        tags: ['variables', 'es6'],
        views: 78,
        upvotes: [createdUsers[0]._id, createdUsers[2]._id],
        downvotes: []
      },
      {
        title: 'How to handle state in React functional components?',
        body: 'I am learning React hooks. How do I manage state in functional components using useState and useEffect?',
        category: createdCategories[2]._id, // React
        author: createdUsers[0]._id,
        tags: ['react', 'hooks', 'state'],
        views: 92,
        upvotes: [createdUsers[1]._id],
        downvotes: []
      },
      {
        title: 'Best practices for MongoDB schema design',
        body: 'What are the best practices for designing schemas in MongoDB? Should I embed or reference documents?',
        category: createdCategories[3]._id, // Database
        author: createdUsers[2]._id,
        tags: ['mongodb', 'schema', 'design'],
        views: 134,
        upvotes: [createdUsers[0]._id, createdUsers[1]._id],
        downvotes: [],
        isSolved: true
      },
      {
        title: 'How to create a REST API with Express.js?',
        body: 'I want to build a REST API using Node.js and Express. What is the recommended folder structure and best practices?',
        category: createdCategories[4]._id, // Node.js
        author: createdUsers[1]._id,
        tags: ['express', 'rest-api', 'nodejs'],
        views: 210,
        upvotes: [createdUsers[0]._id, createdUsers[2]._id],
        downvotes: []
      },
      {
        title: 'Python list comprehension vs map/filter',
        body: 'When should I use list comprehension versus map() and filter() functions in Python?',
        category: createdCategories[1]._id, // Python
        author: createdUsers[2]._id,
        tags: ['python', 'list-comprehension'],
        views: 56,
        upvotes: [createdUsers[1]._id],
        downvotes: []
      }
    ];

    const createdQuestions = await Question.insertMany(questions);
    console.log('Questions Imported...'.green.inverse);

    // Sample answers
    const answers = [
      {
        body: 'Async/await is syntactic sugar built on top of Promises. You use the async keyword before a function to make it return a Promise, and await pauses execution until the Promise resolves. Example:\n\nasync function fetchData() {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}',
        question: createdQuestions[0]._id,
        author: createdUsers[2]._id,
        upvotes: [createdUsers[0]._id, createdUsers[1]._id],
        downvotes: [],
        isAccepted: true
      },
      {
        body: 'var is function-scoped and can be redeclared. let and const are block-scoped. const cannot be reassigned (but objects can be mutated). Use const by default, let when you need to reassign, and avoid var in modern JavaScript.',
        question: createdQuestions[1]._id,
        author: createdUsers[2]._id,
        upvotes: [createdUsers[0]._id],
        downvotes: []
      },
      {
        body: 'Use useState for simple state:\n\nconst [count, setCount] = useState(0);\n\nUse useEffect for side effects:\n\nuseEffect(() => {\n  // side effect code\n  return () => {\n    // cleanup\n  };\n}, [dependencies]);',
        question: createdQuestions[2]._id,
        author: createdUsers[2]._id,
        upvotes: [createdUsers[0]._id, createdUsers[1]._id],
        downvotes: []
      },
      {
        body: 'Embed when data is always accessed together and relationships are one-to-one or one-to-few. Reference when you need to query data independently or have one-to-many/many-to-many relationships. Consider document size limits (16MB) and update frequency.',
        question: createdQuestions[3]._id,
        author: createdUsers[0]._id,
        upvotes: [createdUsers[1]._id, createdUsers[2]._id],
        downvotes: [],
        isAccepted: true
      },
      {
        body: 'Follow MVC pattern: models/, controllers/, routes/. Use middleware for common tasks. Structure:\n\nserver.js - entry point\nroutes/ - route definitions\ncontrollers/ - business logic\nmodels/ - data models\nmiddleware/ - custom middleware\nconfig/ - configuration',
        question: createdQuestions[4]._id,
        author: createdUsers[2]._id,
        upvotes: [createdUsers[0]._id],
        downvotes: []
      }
    ];

    const createdAnswers = await Answer.insertMany(answers);
    console.log('Answers Imported...'.green.inverse);

    // Update questions with accepted answers
    await Question.findByIdAndUpdate(createdQuestions[0]._id, {
      acceptedAnswer: createdAnswers[0]._id,
      isSolved: true
    });

    await Question.findByIdAndUpdate(createdQuestions[3]._id, {
      acceptedAnswer: createdAnswers[3]._id,
      isSolved: true
    });

    console.log('Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Question.deleteMany();
    await Answer.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data'.yellow);
  process.exit();
}
