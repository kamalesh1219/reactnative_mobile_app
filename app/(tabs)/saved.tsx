import eventEmitter from '@/utils/event';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 20;

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
      const saved = await AsyncStorage.getItem('savedMovies');
      const parsed = saved ? JSON.parse(saved) : [];
      setSavedMovies(parsed);
    } catch (err) {
      console.error('Failed to load saved movies', err);
    }
  };

  const removeFromSaved = async (id: number) => {
    try {
      const updated = savedMovies.filter((m) => m.id !== id);
      await AsyncStorage.setItem('savedMovies', JSON.stringify(updated));
      setSavedMovies(updated);
    } catch (err) {
      console.error('Failed to remove movie', err);
    }
  };

  useEffect(() => {
    loadSavedMovies();
  }, []);

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
    <View className="flex-1 pt-16 px-3 bg-black">
      <Text className="text-white text-3xl font-bold text-center mb-4">🎬 Saved Movies</Text>

      <View className="bg-white/10 rounded-full mb-4 px-4 py-2 border border-white/20">
        <TextInput
          placeholder="Search movie title..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="text-white text-sm"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-wrap flex-row justify-between mb-28">
          {filteredMovies.length === 0 ? (
            <Text className="text-white text-center w-full mt-10 text-lg">No movies saved yet.</Text>
          ) : (
            filteredMovies.map((movie) => (
              <View
                key={movie.id}
                className="mb-5 rounded-2xl overflow-hidden bg-white/10 border border-white/10 shadow-xl"
                style={{ width: itemWidth }}
              >
                <TouchableOpacity onPress={() => router.push(`/movies/${movie.id}`)}>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                    className="w-full h-72 rounded-t-2xl"
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <View className="p-3">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-white text-lg font-semibold text-center truncate"
                  >
                    {movie.title}
                  </Text>

                  <View className="flex-row justify-between mt-3">
                    <Pressable
                      className="bg-pink-600 rounded-full px-3 py-2 flex-1 mr-1"
                      onPress={() => router.push(`/movies/${movie.id}`)}
                    >
                      <Text className="text-white text-xs text-center ">▶ Watch</Text>
                      
                    </Pressable>

                    <Pressable
                      className="bg-red-600 rounded-full px-3 py-2 flex-1 ml-1"
                      onPress={() => removeFromSaved(movie.id)}
                    >
                      <Text className="text-white text-xs text-center">✖ Remove</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Saved;
