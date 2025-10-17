// Automated script to extract photo file IDs from Google Drive
// This uses the mapping file to navigate to each Header folder and extract the first image's file ID

const mapping = {
  "P026": { "address": "1 SILVER AVE", "photo_column_k": "1QVTUs88c41PoudjYPtQK2EuJS5bjkmpr" },
  "P028": { "address": "127 STATE ST", "photo_column_k": "1Cg0C5qNDMWst3_KfUsGlbSwljwC5KZXo" },
  "P025": { "address": "101 E. NEW ST", "photo_column_k": "1MS9mcTPJbVA6Oh08advP-g-x7GvXxIST" },
  "P031": { "address": "38 CARPENTER ST", "photo_column_k": "10skcGxV0vOu56mOMCGA-bgDM4vnIEyf5" },
  "P032": { "address": "42 CARPENTER ST", "photo_column_k": "1o-CAFAyClQ-HeL1x8O5OpOWitKhWkaZI" },
  "P033": { "address": "46 CARPENTER ST", "photo_column_k": "17yxF5axiegs8g5KAfvEehsNZFvl60WWI" },
  "P024": { "address": "4 SILVER AVE", "photo_column_k": "17j6Q4M1_7MW1Qn6JTgniOcHN_hqEWBRo" },
  "P020": { "address": "34 CARPENTER ST", "photo_column_k": "1EpFrC-RflSSVPwt23czr6fOHWGJ99kcq" },
  "P023": { "address": "18 WEST ST", "photo_column_k": "1JDGrHLWSE_1i1Xq6XQxXMFAixbnVlFfH" },
  "P034": { "address": "MIDWAY RD", "photo_column_k": "1C2LhA1owWwG6A-zuJaYWI35SYgQ8sak2" },
  "P022": { "address": "202 CARPENTER ST", "photo_column_k": "1Ca_Oq3-tqhJVdhROmcBPvsvDSwY8fdtK" },
  "P021": { "address": "5 SILVER AVE", "photo_column_k": "1Y-rfu1EBpvnYoCW2DWiG3O80mnFAOcPX" },
  "P019": { "address": "18 N. ACADEMY ST", "photo_column_k": "1xm0Gl9FH2AdMbWUTOum1wAuGO3ePPN5Q" },
  "P018": { "address": "601 MORRIS AVE", "photo_column_k": "1SYjXZ0BCIJzm3Wc6Px_n0fZcKZInhL2n" },
  "P017": { "address": "7 NORMAL BLVD", "photo_column_k": "1G5MfYkhDiqLwZum4gefZT92uwxMDnFzI" },
  "P016": { "address": "311 W. NEW ST", "photo_column_k": "1FDbZKeHo2T7X4rR2-SZjFiRtwNmtegVG" },
  "P015": { "address": "313 HAMILTON RD", "photo_column_k": "13AxFU1_qJFvyS3aKxW19ZCwd8dRpqauL" },
  "P014": { "address": "309 W. NEW ST", "photo_column_k": "1QavagCMjRk2anoVoHGTto-cBshSXGOsY" },
  "P013": { "address": "109 STATE ST", "photo_column_k": "19RySpKOINYk3E_m2vePTl0jwUt25s7yN" },
  "P012": { "address": "410 W. HIGH ST", "photo_column_k": "1iCqQMGic0yrZjeGrHWD7fG6cTzM5Fpfy" },
  "P011": { "address": "306 HAMILTON RD", "photo_column_k": "1WDXe8bmjmU63POz65qspmwU54zklyojj" },
  "P010": { "address": "110 STATE ST", "photo_column_k": "1tj4msqcbhj9xQ6GUxeU-vtgwdwgE2qzE" },
  "P009": { "address": "121 STATE ST", "photo_column_k": "1IxexLQeRFR7O82pQh0_HVKy3kSSQVv6i" },
  "P008": { "address": "614 HESTON RD", "photo_column_k": "1dj0H2wzZSrQmxPhoE2xGEupTmQIDzWhw" },
  "P007": { "address": "146 E. HIGH ST", "photo_column_k": "1kNefDBSEYzVSAO2JAAwgMvsi4S8jVqlk" },
  "P006": { "address": "4 WEST ST", "photo_column_k": "1SNEvgK0CV0Rmz0LQZo494ULLPTrj-zhi" },
  "P005": { "address": "122 STATE ST", "photo_column_k": "1gFbFT7A0g6zYv9ccUQ0jDvtFJsdihFW0" },
  "P004": { "address": "11 SILVER AVE", "photo_column_k": "14jvXFrzaEyIkxMOrIX0upXr8-LnwlZLT" },
  "p003": { "address": "50 CARPENTER ST", "photo_column_k": "1HH-D6-MgzKHZj9jF9Hh1R_zM8ZaC20MV" },
  "p002": { "address": "16 WEST ST", "photo_column_k": "1oVXLPD0mAkX7lwi8eZrPO0uacuxmKc8y" },
  "p001": { "address": "9 E. NEW ST", "photo_column_k": "1YprVgtq0VtjJINoVyfUpJUVDkJMH99lp" },
  "P027": { "address": "110 N MAIN ST", "photo_column_k": "1nrp7feQlcvRCMVDAYAOWlEkmDBXBPOd8" },
  "P029": { "address": "113 STATE ST", "photo_column_k": "18JPFKTxO3ivsnu2AP7Cw47GEMPzsRfRI" },
  "P030": { "address": "313 SILVER AVE", "photo_column_k": "1X6BmJP9t4eMY6NRwHfe0rUahLkYOp3Yo" },
  "P040": { "address": "503 N MAIN ST", "photo_column_k": "1IxblT5vueVfxxA7dFLUQf2hfPTRv3bgS" },
  "P039": { "address": "42 MONROE ST", "photo_column_k": "1C2LhA1owWwG6A-zuJaYWI35SYgQ8sak2" },
  "P041": { "address": "7 SPANISH OAK CT", "photo_column_k": "18spc0D4-i7Th1z-DooF60CFH4tJdhw6b" },
  "P035": { "address": "107 E NEW ST APT A", "photo_column_k": "1C2LhA1owWwG6A-zuJaYWI35SYgQ8sak2" },
  "P036": { "address": "107 E NEW ST APT B", "photo_column_k": "1C2LhA1owWwG6A-zuJaYWI35SYgQ8sak2" },
  "P037": { "address": "109 E NEW ST APT A", "photo_column_k": "1C2LhA1owWwG6A-zuJaYWI35SYgQ8sak2" },
  "P038": { "address": "109 E NEW ST APT B", "photo_column_k": "1C2LhA1owWwG6A-zuJaYWI35SYgQ8sak2" }
};

// We already know P026's file ID
const results = {
  "P026": "10l60uUO6Sv7yS6xLysCeN0hC1c07siCk"
};

console.log('Property IDs and their Header folder URLs:');
console.log('===========================================\n');

for (const [propId, data] of Object.entries(mapping)) {
  if (!results[propId]) {
    console.log(`${propId}: https://drive.google.com/drive/folders/${data.photo_column_k}`);
  }
}
