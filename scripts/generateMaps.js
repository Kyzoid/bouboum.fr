const Bouboum_ListeMonde = new Array(5).fill(new Array(29).fill(new Array(19)));

// Map 0
for (let i = 0; i < 29; i++) {
    for (let k = 0; k < 19; k++) {
        if (k % 2 == 0 || i % 2 == 0) {
            if (k < 3 || k > 15 || i < 3 || i > 25) {
                Bouboum_ListeMonde[0][i][k] = 2;
            } else {
                if (Math.random() < 0.2) {
                    Bouboum_ListeMonde[0][i][k] = 0;
                } else {
                    Bouboum_ListeMonde[0][i][k] = 2;
                }
            }
        } else {
            Bouboum_ListeMonde[0][i][k] = 1;
        }
    }
}

// Map 1
for (let i = 0; i < 29; i++) {
    for (let k = 0; k < 19; k++) {
        Bouboum_ListeMonde[1][i][k] = 2;
    }
}

// Map 2
for (let i = 0; i < 29; i++) {
    for (let k = 0; k < 19; k++) {
        if (i == 14 && k >= 2 && k <= 17) {
            Bouboum_ListeMonde[2][i][k] = 1;
        } else {
            if (k == 9 && i >= 2 && i <= 26) {
                Bouboum_ListeMonde[2][i][k] = 1;
            } else {
                if (Math.random() < 0.2) {
                    Bouboum_ListeMonde[2][i][k] = 0;
                } else {
                    Bouboum_ListeMonde[2][i][k] = 2;
                }
            }
        }
    }
}
// Map 3
for (let i = 0; i < 29; i++) {
    for (let k = 0; k < 19; k++) {
        if (k == 9 && i >= 2 && i <= 26) {
            Bouboum_ListeMonde[3][i][k] = 1;
        } else {
            if (Math.random() < 0.2) {
                Bouboum_ListeMonde[3][i][k] = 0;
            } else {
                Bouboum_ListeMonde[3][i][k] = 2;
            }
        }
    }
}
// Map 4
for (let i = 0; i < 29; i++) {
    for (let k = 0; k < 19; k++) {
        if (i == 14 && k >= 2 && k <= 17) {
            Bouboum_ListeMonde[4][i][k] = 1;
        } else {
            if (k == 9 && i >= 2 && i <= 26) {
                Bouboum_ListeMonde[4][i][k] = 1;
            } else
            {
                if((k == 3 || k == 7 || k == 11 || k == 15) && (i == 3 || i == 7 || i ==11 || i == 17 || i == 21 || i == 25)) {								
                    Bouboum_ListeMonde[4][i][k] = 1;
                }
                else {		
                    if (k < 3 || k > 15 || i < 3 || i > 25) {
                        Bouboum_ListeMonde[4][i][k] = 2;
                    } 
                    else {
                        if (Math.random() < 0.2) {
                            Bouboum_ListeMonde[4][i][k] = 0;
                        } else {
                            Bouboum_ListeMonde[4][i][k] = 2;
                        }
                    }
                }
            }
        }
    }
}

console.log(Bouboum_ListeMonde)