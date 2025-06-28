import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/usefetch";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const [tamilMovies, setTamilMovies] = useState([]);
  const [englishMovies, setEnglishMovies] = useState([]);
  const [tamilWebSeries, setTamilWebSeries] = useState([]);

  useEffect(() => {
    const fetchExtraCategories = async () => {
      try {
        const baseURL = "https://api.themoviedb.org/3/discover/movie";
        const headers = {
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
          accept: "application/json",
        };

        const [ta, en, series] = await Promise.all([
          fetch(`${baseURL}?with_original_language=ta&sort_by=popularity.desc&page=1`, { headers }),
          fetch(`${baseURL}?with_original_language=en&sort_by=popularity.desc&page=1`, { headers }),
          fetch(`https://api.themoviedb.org/3/discover/tv?with_original_language=ta&sort_by=popularity.desc&page=1`, { headers }),        
        ]);

        const tamil = await ta.json();
        const english = await en.json();
        const web = await series.json();

        setTamilMovies(tamil.results || []);
        setEnglishMovies(english.results || []);
        setTamilWebSeries(web.results || []);        
      } catch (err) {
        console.error("Category fetch failed", err);
      }
    };

    fetchExtraCategories();
  }, []);

  const renderHorizontalList = (title: string, data: any[]) => (
    <View className="mt-6">
      <Text className="text-xl text-white font-bold mb-4 flex justify-center items-center">{title}</Text>
      <FlatList
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/movies/${item.id}`)}
            className="mr-4 w-40"
          >
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
              className="w-full h-48 rounded-lg"
              resizeMode="cover"
            />
            
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <View className="flex-1 bg-primary ">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5 mb-24"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 20 }}
      >
        <Image source={icons.movieLogo} className="w-14 h-16 mt-20 mb-5 mx-auto" />

        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#00f"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text>Error: {moviesError?.message || trendingError?.message}</Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search for a movie"
            />

            {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                />
              </View>
            )}

            {/* Latest Movies (existing grid) */}
            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Latest Movies
              </Text>
              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-6"
                scrollEnabled={false}
              />
            </>

            {/* New Horizontal Categories */}
            {renderHorizontalList("🎬 Tamil Movies", tamilMovies)}
            {renderHorizontalList("🎞️ English Movies", englishMovies)}
            {renderHorizontalList("📺 Tamil Web Series", tamilWebSeries)}
            
          </View>
        )}
      </ScrollView>
    </View>
  );
}
