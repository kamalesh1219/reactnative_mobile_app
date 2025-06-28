import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';


const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / 3 - 16;

const TMDB_API_KEY = process.env.EXPO_PUBLIC_MOVIE_API_KEY;

const Profile = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const router = useRouter();

  const fetchFavorites = async () => {
  try {
    const tamilRes = await fetch('https://api.themoviedb.org/3/discover/movie?with_original_language=ta&sort_by=popularity.desc&page=1', {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        accept: 'application/json',    
      },
    });

    const englishRes = await fetch('https://api.themoviedb.org/3/discover/movie?with_original_language=en&sort_by=popularity.desc&page=1', {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        accept: 'application/json',
      },
    });


   const tamilJson = await tamilRes.json();
    const englishJson = await englishRes.json();

    // Combine both Tamil and English movies
    const combined = [...tamilJson.results, ...englishJson.results].slice(0, 18);
    setMovies(combined);
  } catch (err) {
    console.error("TMDB fetch error", err);
  }
};

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    
     <ScrollView className="flex bg-gradient-to-b from-pink-900 via-purple-900 to-black px-4 pt-16 pb-10  bg-primary">
      {/* Profile Info */}
      <View className="items-center mb-5">
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNiF96dKTOvN0Ai2EJU-EPXQl6vTQCXB209g&s' }}
          className="w-24 h-24 rounded-full border-2 border-white"
        />
        <Text className="text-white font-bold text-xl mt-3 ">Hello, Movie Buff!</Text>
        <Text className="text-gray-300 text-xs">Discover your favorite picks 🎬</Text>
      </View>

      {/* Movie List */}
     
      <Text className="text-white text-lg font-semibold mb-3">❤️ Top Picks For You</Text>
      <View className="flex-row flex-wrap justify-between">
        {movies.map((movie, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white/10 mb-4 rounded-lg overflow-hidden border border-white/10"
            style={{ width: itemWidth }}
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
              className="w-full h-40"
              resizeMode="cover"
            />
            <Text className="text-white text-center text-lg mt-2 mb-1 px-1 truncate">
              {movie.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Buttons */}
      <View className="flex-row justify-around mt-4 mb-44">
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-full" onPress={() => router.push("/")} >
          <Text className="text-white font-bold">🎥 Your Watchlist</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-pink-500 px-6 py-3 rounded-full">
          <Text className="text-white font-bold">👤 Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
 
  );
};

export default Profile;



