import { graphql } from "@/gql";

const photoFieldsFragment = graphql(`
  fragment PhotoFields on Photo {
    id
    isPrimary
    url
  }
`);

const uploadPhotoMutation = graphql(`
  mutation uploadPhoto($file: File!) {
    uploadPhoto(photo: $file, isPrimary: false) {
      id
      url
      isPrimary
    }
  }
`);

const editPhotoMutation = graphql(`
  mutation uploadPhoto($file: File!) {
    uploadPhoto(photo: $file, isPrimary: false) {
      id
      url
      isPrimary
    }
  }
`);

export { photoFieldsFragment, uploadPhotoMutation };
