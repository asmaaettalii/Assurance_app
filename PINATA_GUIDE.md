# 🗝️ Guide : Configuration Pinata (IPFS)

Pour stocker des fichiers sur IPFS, nous allons utiliser **Pinata**. C'est gratuit et sécurisé.

## Étape 1 : Créer un compte
1. Allez sur [pinata.cloud](https://www.pinata.cloud/)
2. Cliquez sur **"Start Building"** (ou Sign Up)
3. Créez un compte gratuit (Free Plan).

## Étape 2 : Générer une clé API (JWT)
1. Une fois connecté, allez dans le menu **API Keys** (à gauche).
2. Cliquez sur le bouton **"New Key"**.
3. Dans la fenêtre qui s'ouvre :
   - **Name** : Donnez un nom (ex: "AssuranceDApp").
   - **Permissions** : Sélectionnez **Admin** (pour simplifier) ou assurez-vous que `pinFileToIPFS` est coché.
4. Cliquez sur **"Generate Key"**.

## Étape 3 : Copier le JWT
Une fenêtre va s'afficher avec vos clés.
⚠️ **IMPORTANT** : Copiez la longue chaîne de caractères sous **"JWT"**. C'est celle-ci dont nous avons besoin.

*(Ne la perdez pas, elle ne sera affichée qu'une seule fois !)*

## Étape 4 : Ajouter au projet
1. Ouvrez le fichier `frontend-react/.env` (je viens de le créer pour vous).
2. Collez votre JWT après le signe `=` :
   ```env
   VITE_PINATA_JWT=votre_longue_chaine_jwt_ici
   ```
3. Sauvegardez le fichier.
4. **Redémarrez** votre terminal de frontend (`npm run dev`) pour que le changement soit pris en compte.
