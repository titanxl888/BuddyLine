# BuddyLine

A modern AI companion chat application that provides natural, emotionally rich conversations through multiple unique virtual personas.

[中文文档](README_CN.md)

## 📸 Screenshots

<div align="center">
  <img width="45%" alt="明亮模式" src="https://github.com/user-attachments/assets/11784fba-f88f-4ec0-b932-8192bab387ab" />
  <img width="45%" alt="深色模式" src="https://github.com/user-attachments/assets/31b2d6aa-bb3f-43d7-8ea7-72569ecb59a0" />
</div>

## ✨ Features

- **Multi-Persona System** - 3 carefully crafted AI personas, each with unique personality, background, and communication style
- **Custom Personas** - Create, edit, and manage your own custom AI personas
- **Session Management** - Multi-session support with easy switching between different chat histories
- **Smart Message Splitting** - AI responses automatically split into multiple short messages, simulating real instant messaging
- **Export Functionality** - Export chat history as TXT or JSON format
- **Dark Mode** - Built-in light/dark theme toggle
- **Responsive Design** - Perfect adaptation for desktop and mobile devices
- **Local Storage** - All data stored locally in browser for privacy protection
- **Flexible Configuration** - Customize API endpoints, model selection, and parameters

## 🎭 Built-in Personas

### Iris Vale - Artistic Designer
A 28-year-old digital product and visual designer. Calm, thoughtful, and observant. Excels at providing design advice in a human, non-technical way and helps users think clearly when overwhelmed.

### Evan Brooks - Radio Show Host
A 35-year-old late-night radio host. Warm, grounded, and empathetic. Expert listener and storyteller who creates an intimate late-night radio atmosphere.

### Luna Hart - Visual Artist
A 24-year-old freelance painter. Imaginative, expressive, and dreamy. Helps users express feelings through creative language and encourages self-expression and experimentation.

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- OpenAI API key (or compatible API service)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/buddyline.git

# Navigate to project directory
cd buddyline

# Install dependencies
npm install
```

### Running

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will start at `http://localhost:3000`.

### Configuration

On first use, click the **⚙️ Settings** button in the left sidebar to configure:

1. **API Key** - Enter your OpenAI API key
2. **Base URL** - API endpoint address (default: `https://api.openai.com/v1`)
3. **Model** - Select the AI model to use
4. **Temperature** - Adjust response creativity (0-2)
5. **Custom Models** - Add custom model names

## 📖 Usage Guide

### Starting a Conversation

1. Select an AI persona from the top selector
2. Type your message in the input box at the bottom
3. Press Enter or click the send button

### Managing Sessions

- **New Session** - Click the "New Chat" button in the sidebar
- **Switch Sessions** - Click on any session in the sidebar history
- **Edit Title** - Hover over a session and click the ✏️ icon
- **Delete Session** - Hover over a session and click the 🗑️ icon

### Custom Personas

1. Click the "+" button in the top persona selector
2. Fill in persona information:
   - Basic info (name, role, gender, age)
   - Background story
   - Personality traits
   - Interests
   - Communication style
   - Distinctive traits
   - System prompt
3. Save and start using

### Exporting Chat History

1. Click the "Export Chat" button in the sidebar
2. Choose export format:
   - **TXT** - Plain text format, easy to read
   - **JSON** - Structured data, easy to process

## 🛠️ Tech Stack

- **Framework** - [Next.js 14](https://nextjs.org/) (App Router)
- **Language** - [TypeScript](https://www.typescriptlang.org/)
- **Styling** - [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration** - [OpenAI API](https://openai.com/api/)
- **State Management** - React Hooks + Context API
- **Data Persistence** - LocalStorage

## 📁 Project Structure

```
buddyline/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/chat/       # API routes
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Main page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ChatInterface.tsx
│   │   ├── PersonaSelector.tsx
│   │   └── SettingsModal.tsx
│   ├── contexts/           # React Context
│   │   └── ThemeContext.tsx
│   ├── data/              # Static data
│   │   └── personas.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Utility functions
│       ├── ai.ts
│       ├── helpers.ts
│       └── storage.ts
├── public/                # Static assets
└── package.json
```

## 🔒 Privacy & Security

- All chat history is stored only in browser local storage
- API keys are stored locally and never uploaded to any server
- The application does not collect any user data
- Recommended to use environment variables for sensitive information (production)

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to pollinations.ai for providing powerful AI capabilities
- Thanks to all open source project contributors

## 📮 Contact

For questions or suggestions, feel free to reach out:

- Submit an [Issue](https://github.com/yourusername/buddyline/issues)
- Email: your.email@example.com

---

Built with ❤️ to make AI conversations more human

