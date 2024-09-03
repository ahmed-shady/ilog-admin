


// export const loginByAuth = async (email: string, password: string) => {
//   const token = 'I_AM_THE_TOKEN';
//   localStorage.setItem('token', token);
//   removeWindowClass('login-page');
//   removeWindowClass('hold-transition');
//   return token;
// };

// export const registerByAuth = async (email: string, password: string) => {
//   const token = 'I_AM_THE_TOKEN';
//   localStorage.setItem('token', token);
//   removeWindowClass('register-page');
//   removeWindowClass('hold-transition');
//   return token;
// };

export const registerWithEmail = async (email: string, password: string) => {
//   try {
//     const result = await createUserWithEmailAndPassword(
//       firebaseAuth,
//       email,
//       password
//     );
//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// export const loginWithEmail = async (email: string, password: string) => {
//   try {
//     const result = await signInWithEmailAndPassword(
//       firebaseAuth,
//       email,
//       password
//     );
//     return result;
//   } catch (error) {
//     const uu: IUser = {
//       emailVerified: true, isAnonymous: false, refreshToken: "", providerData: [{ displayName: "ahmed", email: "ahmed.ali", phoneNumber: "0233432", photoURL: "photo", providerId: "123", uid: "34234" }],
//       metadata: { creationTime: "", lastSignInTime: "" },
//       tenantId: null,
//       displayName: null,
//       email: null,
//       phoneNumber: null,
//       photoURL: null,
//       providerId: '',
//       uid: '',
//       delete: function (): Promise<void> {
//         throw new Error('Function not implemented.');
//       },
//       getIdToken: function (forceRefresh?: boolean | undefined): Promise<string> {
//         throw new Error('Function not implemented.');
//       },
//       getIdTokenResult: function (forceRefresh?: boolean | undefined): Promise<IdTokenResult> {
//         throw new Error('Function not implemented.');
//       },
//       reload: function (): Promise<void> {
//         throw new Error('Function not implemented.');
//       },
//       toJSON: function (): object {
//         throw new Error('Function not implemented.');
//       }
//     };
//     return {user: uu};
//     //throw error;
//   }
};

export const signInByGoogle = async () => {
  // try {
  //   return await signInWithPopup(firebaseAuth, provider);
  // } catch (error) {
  //   throw error;
  // }
};
