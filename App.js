import React from "react";
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import StarRating from "react-native-star-rating";
import movies from "./movies";
import { useScrollHandler, interpolateColor } from "react-native-redash";
import Animated, { interpolate, Extrapolate } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

function Rating({ value, imdb, rm, mtc }) {
    return (
        <View style={{ marginTop: 15, alignItems: "center" }}>
            <View style={{ flexDirection: "row" }}>
                <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={value}
                    emptyStar="star"
                    fullStarColor="gold"
                    emptyStarColor="rgba(255, 255, 255, 0.2)"
                    starSize={22}
                    buttonStyle={{ marginHorizontal: 5 }}
                />
            </View>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoScore}>{imdb}</Text>
                    <Text style={styles.infoSource}>IMDb</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoScore}>{rm}</Text>
                    <Text style={styles.infoSource}>ROTTEN TOMATOES</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoScore}>{mtc}</Text>
                    <Text style={styles.infoSource}>MTC</Text>
                </View>
            </View>
        </View>
    );
}

function Slide({ image, title, genres, rating, movieIndex, scrollX }) {
    const inputRange = [(movieIndex - 1) * width, movieIndex * width, (movieIndex + 1) * width];

    const scale = interpolate(scrollX, {
        inputRange,
        outputRange: [0.75, 1, 0.75],
        extrapolate: Extrapolate.CLAMP,
    });

    const opacity = interpolate(scrollX, {
        inputRange: [(movieIndex - 0.75) * width, movieIndex * width, (movieIndex + 0.75) * width],
        outputRange: [0, 1, 0],
    });

    return (
        <View style={[styles.slideContainer]}>
            <Animated.View style={[styles.slide, { transform: [{ scale }] }]}>
                <Image style={styles.slideShadow} resizeMode="contain" source={require("./assets/shadow.png")} />
                <Image style={styles.slideImage} source={image.src} />
            </Animated.View>
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)"]} style={styles.slideGradient} />
            <Animated.View style={{ alignItems: "center", flex: 1, opacity}}>
                <Text style={styles.slideTitle}>{title}</Text>
                <View style={styles.genresContainer}>
                    {genres.map((genre, genreIndex) => (
                        <View key={genreIndex} style={styles.genre}>
                            <Text style={styles.genreText}>{genre}</Text>
                        </View>
                    ))}
                </View>
                <Rating {...rating} />
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>Buy ticket</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

function Slider() {
    const { scrollHandler, x: scrollX } = useScrollHandler();
    const backgroundColor = interpolateColor(scrollX, {
        inputRange: movies.map((_, index) => index * width),
        outputRange: movies.map((movie) => movie.backgroundColor),
    });

    return (
        <Animated.View style={{ backgroundColor, flex: 1 }}>
            <Animated.ScrollView
                style={styles.sliderContainer}
                horizontal
                snapToInterval={width}
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                bounces={false}
                {...scrollHandler}>
                {movies.map((movie, movieIndex) => {
                    return <Slide key={movieIndex} {...{ ...movie, movieIndex, scrollX }} />;
                })}
            </Animated.ScrollView>
        </Animated.View>
    );
}

export default function App() {
    return (
        <View style={styles.container}>
            <Slider />
        </View>
    );
}

const onPress = () => {};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    sliderContainer: { flex: 1 },
    slideContainer: { paddingTop: 80, alignItems: "center", width },
    slide: {
        alignItems: "center",
        width: width,
        height: height * 0.58,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 30,
        },
        shadowOpacity: 0.2,
        shadowRadius: 40,
    },
    slideShadow: {
        width: width * 0.9,
        height: 200,
        position: "absolute",
        top: height * 0.55 - 85,
        opacity: 0.25,
    },
    slideImage: {
        borderRadius: 40,
        width: width * 0.8,
        height: height * 0.55,
    },
    slideGradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: height * 0.4,
    },
    slideTitle: {
        color: "white",
        fontSize: 30,
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase",
        marginTop: 0,
    },
    genresContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    genre: {
        backgroundColor: "rgba(255, 255, 255, 0.075)",
        borderWidth: 0.5,
        borderColor: "rgba(255, 255, 255, 0.2)",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginHorizontal: 4,
    },
    genreText: {
        fontSize: 9,
        color: "rgba(255, 255, 255, 0.75)",
    },
    infoContainer: {
        alignItems: "center",
        marginHorizontal: 16,
    },
    infoScore: {
        fontSize: 20,
        color: "white",
        fontWeight: "700",
        textAlign: "center",
    },
    infoSource: {
        color: "rgba(255, 2555, 255, 0.3)",
        marginTop: 4,
        fontSize: 11,
        fontWeight: "600",
        textAlign: "center",
    },
    button: {
        width: width * 0.55,
        alignItems: "center",
        backgroundColor: "transparent",
        borderColor: "white",
        borderWidth: 3,
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 30,
        position: "absolute",
        bottom: 0,
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "700",
    },
});
