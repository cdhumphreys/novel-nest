'use server';

import { getCurrentUser } from "@/lib/sessions";
import { getFavouritesByProfileId, addToFavourites, getProfileByUserId, removeFromFavourites } from "@/data-access/profiles";

export async function toggleFavouritesAction(bookId: number) {
    const { user } = await getCurrentUser();
    if (!user) {
        return { errors: { root: 'User not found' } }
    }

    const profile = await getProfileByUserId(user.id);
    if (!profile) {
        return { errors: { root: 'Profile not found' } }
    }

    const favourites = await getFavouritesByProfileId(profile.id);

    if (favourites.some((favourite) => favourite.id === bookId)) {
        await removeFromFavourites(profile.id, bookId);
    } else {
        await addToFavourites(profile.id, bookId);

    }

    return { success: true }

}