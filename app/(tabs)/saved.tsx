import { images } from '@/constants/images';
import { useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzOGE4ZjBlMWQxYzc3NGMxMGUyODJlNzEzYTJhYTEwYiIsIm5iZiI6MTc0OTQ1MzY2MS4wLCJzdWIiOiI2ODQ2OGI1Y2EwYzZlNTA0MWViYjMwYzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.clB7JBENuY5mpNOZ8MlBnxXQWFjiVxROuJWyWZWa6b8";

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 3 - 16;

const Saved = () => {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMovies = async () => {
    try {
      const url = searchQuery.trim()
        ? `https://api.themoviedb.org/3/search/movie?query=${searchQuery}&include_adult=false&language=en-US&page=1`
        : `https://api.themoviedb.org/3/discover/movie?with_original_language=ta&sort_by=popularity.desc&page=1`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          accept: 'application/json',
        },
      });
      const json = await res.json();
      setMovies(json.results || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [searchQuery]);

  return (
    <View className="flex-1 pt-20 px-2 bg-primary">
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover" />
      {/* Header */}
      <Text className="text-white text-3xl font-bold text-center mb-4">🎬 Saved Movies</Text>

      {/* Search Bar */}
      <View className="bg-white/10 rounded-full mb-6 px-4 py-2 border border-white/20">
        <TextInput
          placeholder="Search movie title..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="text-white text-sm"
        />
      </View>

      {/* Movie Grid */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-wrap flex-row justify-between mb-20">
          {movies.map((movie, index) => (
            <View
              key={index}
              className="mb-5 rounded-xl overflow-hidden bg-white/10 border border-white/10"
              style={{ width: itemWidth }}
            >
              
              <TouchableOpacity
                onPress={() => router.push(`/movies/${movie.id}`)}
              >
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
              </TouchableOpacity>

              <View className="p-2">
                <Text 
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-white text-xs font-bold text-center truncate"
                >
                  {movie.title}                 
                </Text>
                <Pressable
                  className="bg-pink-500 mt-2 rounded-full py-3"
                  onPress={() => router.push(`/movies/${movie.id}`)}
                >
                  <Text className="text-white text-xs text-center">Watch</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Saved;
