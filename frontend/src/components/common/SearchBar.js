import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Popper,
  Fade,
  ClickAwayListener
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StyledSearchBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  maxWidth: '600px',
  margin: '0 auto',
}));

const StyledPopper = styled(Popper)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  zIndex: theme.zIndex.modal,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    cursor: 'pointer',
  },
}));

const SearchBar = ({ onSearch, placeholder = 'Search...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const anchorRef = useRef(null);

  useEffect(() => {
    // Load search history from localStorage
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    setSearchHistory(history);
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setIsPopperOpen(true);

    // Reset selected index when search term changes
    setSelectedIndex(-1);

    if (value.trim()) {
      // Filter suggestions based on search term
      const filtered = [
        ...searchHistory.filter(item =>
          item.toLowerCase().includes(value.toLowerCase())
        ),
      ].slice(0, 5);

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (term) => {
    if (!term.trim()) return;

    // Add to search history
    const newHistory = [
      term,
      ...searchHistory.filter(item => item !== term)
    ].slice(0, 10);

    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Call the onSearch prop
    onSearch(term);
    setIsPopperOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!isPopperOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSearch(suggestions[selectedIndex]);
          setSearchTerm(suggestions[selectedIndex]);
        } else {
          handleSearch(searchTerm);
        }
        break;
      case 'Escape':
        setIsPopperOpen(false);
        break;
      default:
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setIsPopperOpen(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    setSuggestions([]);
  };

  return (
    <ClickAwayListener onClickAway={() => setIsPopperOpen(false)}>
      <StyledSearchBox>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          ref={anchorRef}
          onFocus={() => setIsPopperOpen(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <StyledPopper
          open={isPopperOpen}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper>
                <List>
                  {suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <StyledListItem
                        key={suggestion}
                        selected={index === selectedIndex}
                        onClick={() => {
                          setSearchTerm(suggestion);
                          handleSearch(suggestion);
                        }}
                      >
                        <HistoryIcon
                          fontSize="small"
                          sx={{ mr: 1, color: 'action.active' }}
                        />
                        <ListItemText primary={suggestion} />
                      </StyledListItem>
                    ))
                  ) : searchTerm ? (
                    <ListItem>
                      <ListItemText
                        primary="No results found"
                        secondary="Try different keywords"
                      />
                    </ListItem>
                  ) : searchHistory.length > 0 ? (
                    <>
                      <Box
                        sx={{
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Recent Searches
                        </Typography>
                        <Chip
                          label="Clear All"
                          size="small"
                          onClick={clearHistory}
                        />
                      </Box>
                      {searchHistory.map((item, index) => (
                        <StyledListItem
                          key={item}
                          onClick={() => {
                            setSearchTerm(item);
                            handleSearch(item);
                          }}
                        >
                          <HistoryIcon
                            fontSize="small"
                            sx={{ mr: 1, color: 'action.active' }}
                          />
                          <ListItemText primary={item} />
                        </StyledListItem>
                      ))}
                    </>
                  ) : null}
                </List>
              </Paper>
            </Fade>
          )}
        </StyledPopper>
      </StyledSearchBox>
    </ClickAwayListener>
  );
};

export default SearchBar;