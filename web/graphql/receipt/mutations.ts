// import { graphql } from "@/gql";

// export const editReceiptMutation = graphql(
//   `
//     mutation editReceipt($receiptId: String!, $receipt: UpdateReceipt!) {
//       updateReceipt(receipt: $receipt, receiptId: $receiptId) {
//         id
//         imagePath
//         total
//         merchantName
//         matchingStore {
//           id
//           name
//         }
//         date
//         items {
//           ...ReceiptItem
//         }
//         scanned
//       }
//     }
//   `
// );
