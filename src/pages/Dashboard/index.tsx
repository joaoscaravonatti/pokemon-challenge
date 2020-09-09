import React, { useEffect, useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { FiSearch, FiChevronRight, FiChevronLeft } from 'react-icons/fi';

import {
  Container,
  SearchInput,
  PokemonList,
  Pagination,
  Button,
} from './styles';
import Header from '../../components/Header';
import Card from '../../components/Card';

import api from '../../services/api';

interface IPokemon {
  id: number;
  name: string;
  url: string;
  types: string;
}

const Dashboard: React.FC = () => {
  const [pokemons, setPokemons] = useState<IPokemon[]>([]);
  const [pokemonsShow, setPokemonsShow] = useState<IPokemon[]>([]);
  const [allPokemons, setAllPokemons] = useState<IPokemon[]>([]);
  const [name, setName] = useState('');

  const [page, setPage] = useState(0);
  const [next, setNext] = useState();
  const [previous, setPrevious] = useState();

  const history = useHistory();

  useEffect(() => {
    api.get(`/pokemon/?offset=0&limit=1060`).then(response => {
      setAllPokemons(response.data.results);
    });
  }, []);

  useEffect(() => {
    if (!name) {
      api.get(`/pokemon/?offset=${page}&limit=20`).then(response => {
        setPokemons(response.data.results);
        setNext(response.data.next);
        setPrevious(response.data.previous);
      });

      setPokemonsShow(pokemons);
    }
  }, [pokemons, page, name]);

  const navigateToDetail = useCallback(() => {
    history.push('Detail');
  }, []);

  useEffect(() => {
    const result = allPokemons.filter(pokemon => pokemon.name.includes(name));
    setPokemonsShow(result);
  }, [name, allPokemons]);

  const handleNextPage = useCallback(() => {
    if (next) {
      setPage(page + 20);
    }
  }, [page, next]);

  const handlePreviousPage = useCallback(() => {
    if (previous) {
      setPage(page - 20);
    }
  }, [page, previous]);

  return (
    <>
      <Header />
      <Container>
        <SearchInput>
          <FiSearch />
          <input
            placeholder="Type the Pokémon name"
            onChange={e => setName(e.target.value)}
          />
        </SearchInput>
      </Container>
      <PokemonList>
        {pokemonsShow.map(pokemon => (
          <Card
            key={pokemon.name}
            name={pokemon.name}
            types={pokemon.name}
            onClick={navigateToDetail}
          />
        ))}
      </PokemonList>

      <Pagination>
        <Button onClick={handlePreviousPage}>
          {previous && <FiChevronLeft color="#666360" />}
        </Button>
        <Button onClick={handleNextPage}>
          {next && <FiChevronRight color="#666360" />}
        </Button>
      </Pagination>
    </>
  );
};

export default Dashboard;
