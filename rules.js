rules_version = '2';
service cloud.firestore {
    match /databases/{database}/documents {
    // Function: Check if is logged in
    function isLoggedIn(){
      return request.auth != null;
    }
    // Function: Has any role
    function hasAnyRole(roles) {
      return  get(/databases/$(database)/documents/users/$(request.auth.uid)).data.roles.hasAny(roles)
    }
    // Function: is data owner NOT WORKING!
    function isDataOwner(){
     return resource.data.userId == request.auth.uid || resource.data.uid == request.auth.uid;
    }
    // CONFIG
    match /config/{document=**}{
        allow read: if
            true;
        allow write: if
            isLoggedIn() && hasAnyRole(["admin"]);
    }
    // REPORTS
    match /reports/{document=**}{
        allow read: if
            true;
        allow write: if
            isLoggedIn();
    }
		// USERS
    match /users/{document=**} {
      allow read: if
          true;
      allow write: if
          isLoggedIn();
    }
    // POSTS
    match /posts/{document=**} {
      allow read: if resource.data.visibility == 'public';
      allow write: if
          isLoggedIn();
    }
    // STEPS
    match /posts/{postId}/steps/{document=**} {
      allow read: if
          true;
      allow write: if
          isLoggedIn();
    }
     // LISTS
    match /posts/{postId}/lists/{document=**} {
      allow read: if
          true;
      allow write: if
          isLoggedIn();
    }
    
  }
}