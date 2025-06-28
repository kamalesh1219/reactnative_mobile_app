import eventEmitter from '@/utils/event'; // 👈 Import eventEmitter
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 2 - 16;

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const Saved = () => {
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSavedMovies = async () => {
    try {
      const saved = await AsyncStorage.getItem("savedMovies");
      const parsed = saved ? JSON.parse(saved) : [];
      setSavedMovies(parsed);
    } catch (err) {
      console.error("Failed to load saved movies", err);
    }
  };

  const removeFromSaved = async (id: number) => {
    try {
      const updated = savedMovies.filter((m) => m.id !== id);
      await AsyncStorage.setItem("savedMovies", JSON.stringify(updated));
      setSavedMovies(updated);
    } catch (err) {
      console.error("Failed to remove movie", err);
    }
  };

  // Initial load + on search
  useEffect(() => {
    loadSavedMovies();
  }, []);

  // Listen for new saved movies
 useEffect(() => {
  const onSave = () => {
    loadSavedMovies();
  };

  eventEmitter.on('movie_saved', onSave);

  return () => {
    eventEmitter.off('movie_saved', onSave);
  };
}, []);

  const filteredMovies = savedMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View className="flex-1 pt-20 px-2 bg-primary">
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
          {filteredMovies.map((movie) => (
            <View
              key={movie.id}
              className="mb-5 rounded-xl overflow-hidden bg-white/10 border border-white/10"
              style={{ width: itemWidth }}
            >
              <TouchableOpacity onPress={() => router.push(`/movies/${movie.id}`)}>
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

                {/* Watch Button */}
                <Pressable
                  className="bg-pink-500 mt-2 rounded-full py-3"
                  onPress={() => router.push(`/movies/${movie.id}`)}
                >
                  <Text className="text-white text-xs text-center">Watch</Text>
                </Pressable>

                {/* Remove Button */}
                <Pressable
                  className="bg-red-600 mt-2 rounded-full py-3"
                  onPress={() => removeFromSaved(movie.id)}
                >
                  <Text className="text-white text-xs text-center">Remove</Text>
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



