import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme, createBreakpoints } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const breakpointValues = {
  xs: 0,
  sm: 481,
  md: 768,
};

const theme = createMuiTheme({ breakpoints: { values: breakpointValues } });
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(3),
    minWidth: 220,
  },
  card: {
    '&:hover': {
      cursor: 'pointer',
      boxShadow: '2px 2px 15px 0px #000000'
    },
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5
  },
  media: {
    height: 0,
    paddingTop: '56.25%',
  },
}))

export default function CountryCard() {
  const classes = useStyles();
  const [countries, setCountries] = useState([]);
  const [data, setData] = useState([])
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('nameAsc');
  const [subregionFilter, setSubregionFilter] = useState('Show All');
  const [languageFilter, setLanguageFilter] = useState('Show All');
  const [border, setBorder] = useState(false);

  const url = "https://restcountries.eu/rest/v2/region/europe";

  let subregions = ['Show All'];
  let languages = ['Show All'];

  // get all countries 
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          setCountries(result);
          setData(result);
        },
        (error) => {
          setError(error)
        }
      )
    
    }, []);

  // sorting
  useEffect(() => {
    const handleSortChange = () => {
      let sortedCountries = [];
      if (sort === "nameDesc") {
        sortedCountries = [...data].sort((a, b) => b.name.localeCompare(a.name));
      } else if (sort === "nameAsc") {
        sortedCountries = [...data].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sort === "popAsc") {
        sortedCountries = [...data].sort((a, b) => a.population - b.population );
      } else if (sort === "popDesc") {
        sortedCountries = [...data].sort((a, b) => b.population - a.population );
      }
      setData(sortedCountries);
    }

    handleSortChange();
    
  }, [sort])
  
  // subregion filter
  useEffect(() => {
    const handleSubregionFilter = () => {
      let filteredCountries = [];
      if (subregionFilter === "Show All") {
        filteredCountries = countries;
      } else {
        filteredCountries = countries.filter(country => country.subregion === subregionFilter);
      };
      setData(filteredCountries);
    }
    handleSubregionFilter();
}, [subregionFilter])

  // language filter
  useEffect(() => {
      const handleLangFilter = () => {
        let filteredCountries = [];
        if (languageFilter === "Show All") {
          filteredCountries = countries;
        } else {
          filteredCountries = data.filter(country => country.languages.length === languageFilter);
        };
        setData(filteredCountries);
      }
      handleLangFilter();
  }, [languageFilter])

  const showBorderCountries = (country, i) => {
    let borders = country.borders;
    data.forEach(d => {
      borders.forEach(b => {
        if (d.alpha3Code !== b) {
          // TODO: add opacity to countries that do not border selected country
        }
      })
    })
  }


  // get each country's subregion and language
  countries.forEach(country => {
    subregions.push(country.subregion);
    languages.push(country.languages.length);

    // create array with no duplicates
    subregions = [...new Set(subregions)];
    languages = [...new Set(languages)];
  });


  if (error) {
    return <div>Error: {error.message}</div>;
  } else {
    return (
      <MuiThemeProvider theme={theme}>
        <FormControl className={classes.formControl}>
          <InputLabel>Sort By:</InputLabel>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
            <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
            <MenuItem value="popAsc">Population (Low to High)</MenuItem>
            <MenuItem value="popDesc">Population (High to Low)</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Filter by Subregion:</InputLabel>
          <Select
            value={subregionFilter}
            onChange={(e) => setSubregionFilter(e.target.value)}>
            {subregions.map((region, i) => (
              <MenuItem value={region} key={i}>{region}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel>Filter by # of Languages</InputLabel>
          <Select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}>
            {languages.map((lang, i) => (
              <MenuItem value={lang} key={i}>{lang}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid container className={classes.root} spacing={2}>
          {data.map((country, i) => (
            <Grid key={i} md={4} sm={6} xs={12} className={classes.root}>
              <Card className={classes.card} onClick={() => showBorderCountries(country, i)}>
                <CardHeader title={country.name}/>
                <CardMedia
                  className={classes.media}
                  image={country.flag} />
                <CardContent>
                  <Typography component="p">
                    Subregion: {country.subregion}
                  </Typography>
                  <Typography>
                    Capital: {country.capital}
                  </Typography>
                  <Typography>
                    Total Population: {country.population.toLocaleString()}
                  </Typography>
                  <Typography>
                    Number of Languages: {country.languages.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MuiThemeProvider>
    )}
}
