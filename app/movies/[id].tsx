import { fetchMovieDetails } from '@/services/api'; // your TMDB API function
import useFetch from '@/services/usefetch'; // replace with your hook
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const screenHeight = Dimensions.get('window').height;

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string));

  interface MovieInfoProps {
    label: string;
    value?: string | number | null;
  }

  const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="text-light-200 font-normal text-sm">{label}</Text>
      <Text className="text-light-100 font-bold text-sm mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );

  if (loading || !movie) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const {
    title,
    poster_path,
    backdrop_path,
    release_date,
    overview,
    runtime,
    vote_average,
    genres = [],
  } = movie;

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="relative">
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w780${backdrop_path || poster_path}` }}
          className="w-full"
          style={{ height: screenHeight * 0.55 }}
        />
        <View className="absolute top-10 left-4 rounded-full border bg-white/10  border-white/20">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-white text-4xl py-1 px-1"> ← </Text>
          </TouchableOpacity>
        </View>

        <View className='absolute top-8 right-4 rounded-full border bg-white/10  border-white/20 '>
          <TouchableOpacity>
            <Text className='text-white text-4xl py-1 flex justify-center items-center'> ⋯ </Text>
          </TouchableOpacity>
        </View>

        {/* Overlay Title and Meta Info */}
        <View className="absolute bottom-0 left-0 right-0 px-5 pt-10 bg-black/40" style={{ paddingBottom:  bottom + 20 }}>
          <Text className="text-white text-3xl font-bold">{title}</Text>
          {runtime !== null && runtime !== undefined && (
          <Text className="text-gray-400 mt-2 ">{release_date?.split("-")[0]}  |  ⭐ {vote_average?.toFixed(1)}  |   {Math.floor(runtime / 60)}h {runtime % 60}min</Text>
          )}
          </View>
      </View>

      {/* Genre Tags */}
      <View className="flex-row flex-wrap items-center gap-2 px-5 mt-3">
        {genres.map((genre: any) => (
          <Text key={genre.id} className="border bg-white/10  border-white/20 text-white px-3 py-2 rounded-full text-xs">
            {genre.name}
          </Text>
        ))}
      </View>

      {/* Buttons */}
      <View className="flex-row justify-around px-5 mt-5">
        <Pressable className="bg-pink-500 px-6 py-4 rounded-full">
          <Text className=" text-white font-semibold">🎬 Trailer</Text>
        </Pressable>
        <Pressable className="bg-blue-500 px-7 py-4 rounded-full">
          <Text className="text-white font-semibold">▶ Watch Now</Text>
        </Pressable>
      </View>

      {/* Actions */}
      <View className="flex-row justify-around px-6 mt-6">
        <Pressable className="items-center">
          <Ionicons name="bookmark-outline" size={22} color="white" />
          <Text className="text-white text-xs">Save </Text>
        </Pressable>
        <Pressable className="items-center">
          <Ionicons name="share-social-outline" size={22} color="white" />
          <Text className="text-white text-xs">Share  </Text>
        </Pressable>
        <Pressable className="items-center">
          <Ionicons name="download-outline" size={22} color="white" />
          <Text className="text-white text-xs">Download   </Text>
        </Pressable>
      </View>

      {/* Storyline */}
      <View className="mt-6 px-5 mb-4">
        <Text className="text-white text-lg font-bold mb-2">📖 Storyline</Text>
        <Text className="text-gray-300 text-base leading-6 italic ">{overview}</Text>
      </View>


        <View className='flex flex-row justify-between w-1/2 px-5 mb-3 '>
          <MovieInfo label="💰 Budget" value={`$${movie?.budget / 1_000_000} million`}/>
          <MovieInfo label="💵 Revenue" value={`$${Math.round(movie?.revenue)/1_000_000}`}/>
        </View>  

        <View className="px-5 mt-4 mb-14">
            <Text className="text-white font-bold text-lg mb-2">🎭 Cast & Crew</Text>
            <Text className="text-gray-300 text-sm mb-2">Language: {movie.original_language?.toUpperCase()}</Text>
            <Text className="text-gray-300 text-sm mb-2">Status: {movie.status}</Text>
            <Text className="text-gray-300 text-sm mb-2">Budget: ${movie.budget?.toLocaleString()}</Text>
            <Text className="text-gray-300 text-sm mb-2">Revenue: ${movie.revenue?.toLocaleString()}</Text>
            <Text className="text-gray-300 text-sm mb-2">Country: {movie.production_countries?.[0]?.name}</Text>
            <Text className="text-gray-300 text-sm mb-2">Production: {movie.production_companies?.map(p => p.name).join(', ')}</Text>
      </View>
    </ScrollView>
  );
};

export default MovieDetails;