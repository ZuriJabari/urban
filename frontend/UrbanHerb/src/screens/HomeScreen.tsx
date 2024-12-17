// frontend/UrbanHerb/src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { usePerformanceTracking } from '../utils/hooks/usePerformanceTracking';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export const HomeScreen = () => {
  usePerformanceTracking('HomeScreen');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Urban Herb</Text>
        <Text style={styles.subtitle}>Your Natural Health Store</Text>
      </View>

      <Card style={styles.featuredCard}>
        <Text style={styles.cardTitle}>Featured Products</Text>
        <Text style={styles.cardDescription}>
          Discover our handpicked selection of natural remedies and wellness products.
        </Text>
        <Button 
          title="Shop Now"
          onPress={() => {}}
          style={styles.button}
        />
      </Card>

      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Herbs', 'Supplements', 'Essential Oils', 'Tea', 'Wellness'].map((category) => (
            <Card 
              key={category}
              style={styles.categoryCard}
              onPress={() => {}}
              variant="outlined"
            >
              <Text style={styles.categoryText}>{category}</Text>
            </Card>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.primary.main,
  },
  title: {
    ...typography.variants.h1,
    color: colors.text.light,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.variants.subtitle1,
    color: colors.text.light,
  },
  featuredCard: {
    margin: spacing.md,
    padding: spacing.lg,
  },
  cardTitle: {
    ...typography.variants.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    ...typography.variants.body1,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
  button: {
    alignSelf: 'flex-start',
  },
  categoriesSection: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.variants.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  categoryCard: {
    marginRight: spacing.sm,
    minWidth: 120,
    padding: spacing.md,
  },
  categoryText: {
    ...typography.variants.subtitle2,
    color: colors.text.primary,
    textAlign: 'center',
  },
});