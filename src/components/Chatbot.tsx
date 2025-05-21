import * as React from 'react';
import { 
  ChatCircleText, 
  X, 
  PaperPlaneRight,
  Globe,
  PlayCircle
} from '@phosphor-icons/react/dist/ssr';
import {
  Box,
  IconButton,
  TextField,
  Typography,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Collapse,
  Fade,
} from '@mui/material';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  relatedQuestions?: string[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [language, setLanguage] = React.useState('en');
  const [demoMode, setDemoMode] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Default related questions for fallback
  const defaultRelatedQuestions = [
    "Do I Need Technical Skills to Use NigedEase?",
    "What is NigedEase?",
    "Key Features",
    "Benefits",
    "Sample Inventory",
    "Sample Sales"
  ];

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    handleSettingsClose();
    // Update settings on backend
    fetch('http://127.0.0.1:5001/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang, demo_mode: demoMode }),
    });
  };

  const handleDemoModeToggle = () => {
    const newDemoMode = !demoMode;
    setDemoMode(newDemoMode);
    handleSettingsClose();
    // Update settings on backend
    fetch('http://127.0.0.1:5001/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, demo_mode: newDemoMode }),
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          language,
          demo_mode: demoMode
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.response,
            relatedQuestions: data.related_questions || defaultRelatedQuestions
          }
        ]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Fade in={!isOpen}>
          <IconButton
            onClick={() => setIsOpen(true)}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 56,
              height: 56,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.2s',
            }}
          >
            <ChatCircleText size={28} weight="fill" />
          </IconButton>
        </Fade>
      </Box>

      {/* Chat Window */}
      <Collapse
        in={isOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: { xs: 'calc(100vw - 48px)', sm: 380 },
            height: 500,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              NIGED-EASE Assistant
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={handleSettingsClick}
                sx={{ color: 'white' }}
              >
                <Globe size={20} weight="fill" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: 'white' }}
              >
                <X size={20} weight="fill" />
              </IconButton>
            </Box>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                    color: message.role === 'user' ? 'white' : 'text.primary',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                  {/* Show related questions for assistant messages only */}
                  {message.role === 'assistant' && message.relatedQuestions && message.relatedQuestions.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Related Questions:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {message.relatedQuestions.map((q) => (
                          <Paper
                            key={q}
                            onClick={() => setInput(q)}
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              bgcolor: 'grey.200',
                              color: 'primary.main',
                              borderRadius: 2,
                              cursor: 'pointer',
                              '&:hover': { bgcolor: 'primary.light', color: 'white' },
                              fontSize: 14,
                            }}
                            elevation={0}
                          >
                            {q}
                          </Paper>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ alignSelf: 'flex-start' }}>
                <CircularProgress size={20} />
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <IconButton
                type="submit"
                disabled={!input.trim() || isLoading}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500',
                  },
                }}
              >
                <PaperPlaneRight size={20} weight="fill" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Collapse>

      {/* Settings Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSettingsClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <MenuItem onClick={() => handleLanguageChange('en')}>
          <ListItemIcon>
            <Globe size={20} />
          </ListItemIcon>
          <ListItemText 
            primary="English" 
            secondary={language === 'en' ? 'Current' : ''} 
          />
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('am')}>
          <ListItemIcon>
            <Globe size={20} />
          </ListItemIcon>
          <ListItemText 
            primary="አማርኛ" 
            secondary={language === 'am' ? 'Current' : ''} 
          />
        </MenuItem>
        <MenuItem onClick={handleDemoModeToggle}>
          <ListItemIcon>
            <PlayCircle size={20} />
          </ListItemIcon>
          <ListItemText 
            primary="Demo Mode" 
            secondary={demoMode ? 'Enabled' : 'Disabled'} 
          />
        </MenuItem>
      </Menu>
    </>
  );
}