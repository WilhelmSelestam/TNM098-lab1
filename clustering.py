import matplotlib.pyplot as plt
from sklearn.cluster import DBSCAN
import numpy as np
import pandas as pd

df = pd.read_csv('C:/Skola/TNM098-Avancerad_visuell_dataanalys/lab1/eye-tracking/public/EyeTrack-raw.tsv', sep='\t')
X = df[["GazePointX(px)", "GazePointY(px)"]].to_numpy()

clustering = DBSCAN(eps=55, min_samples=18).fit(X)
labels = clustering.labels_

plt.figure(figsize=(10, 6))

scatter = plt.scatter(X[:, 0], X[:, 1], c=labels, cmap='tab20', s=10, alpha=0.6)

plt.title('DBSCAN Clustering of Gaze Points')
plt.xlabel('GazePointX (px)')
plt.ylabel('GazePointY (px)')
plt.colorbar(scatter, label='Cluster Label (-1 = Noise)')

plt.gca().invert_yaxis() 
plt.show()

# --- 1. Förbered data (samma som tidigare) ---
df['ClusterLabel'] = labels
df_filtered = df[df['ClusterLabel'] != -1].copy()

# Skapa sekvensen (ta bort upprepningar efter varandra)
s = df_filtered['ClusterLabel']
sequence = s[s != s.shift()].tolist()

# Skapa transitions-matrisen med Pandas
if len(sequence) > 1:
    # Skapa par av (från, till)
    from_list = sequence[:-1]
    to_list = sequence[1:]
    
    # Skapa matrisen
    matrix = pd.crosstab(pd.Series(from_list, name='Från'), 
                         pd.Series(to_list, name='Till'))
    
    output_filepath = 'C:/Skola/TNM098-Avancerad_visuell_dataanalys/lab1/eye-tracking/public/trans_matrix.tsv'
    matrix.to_csv(output_filepath, sep='\t', index=False, header=False)


    # --- 2. Visualisera med enbart Matplotlib ---
    plt.figure(figsize=(8, 6))
    
    # imshow ritar ut matrisen som en bild
    im = plt.imshow(matrix, cmap='YlGnBu', aspect='auto')
    
    # Lägg till färgskala
    plt.colorbar(im, label='Antal transitions')

    # Fixa axlar (vi vill ha kluster-ID som labels)
    plt.xticks(range(len(matrix.columns)), matrix.columns)
    plt.yticks(range(len(matrix.index)), matrix.index)
    
    plt.xlabel('Till AOI (Kluster)')
    plt.ylabel('Från AOI (Kluster)')
    plt.title('Transitions mellan Areas of Interest')

    # Lägg till siffror i rutorna manuellt
    for i in range(len(matrix.index)):
        for j in range(len(matrix.columns)):
            plt.text(j, i, matrix.iloc[i, j], 
                     ha="center", va="center", color="black")

    plt.show()

    print("\nSekvens av besökta AOIs:")
    print(sequence)
else:
    print("Inte tillräckligt med data för att beräkna transitions.")

# df['ClusterLabel'] = clustering.labels_

# output_filepath = 'C:/Skola/TNM098-Avancerad_visuell_dataanalys/lab1/eye-tracking/public/EyeTrack-clustered.tsv'
# df.to_csv(output_filepath, sep='\t', index=False)

# from sklearn.neighbors import NearestNeighbors


# nearest_neighbors = NearestNeighbors(n_neighbors=5)
# neighbors = nearest_neighbors.fit(X)
# distances, indices = neighbors.kneighbors(X)


# distances = np.sort(distances[:, 4], axis=0)

# plt.figure(figsize=(10, 6))
# plt.plot(distances)
# plt.title('K-Distance Graph for optimal eps')
# plt.xlabel('Data Points (sorted by distance)')
# plt.ylabel('Distance to 5th Nearest Neighbor (px)')
# plt.grid(True, linestyle='--', alpha=0.7)

# # Zoom in on the Y-axis if the maximum distances are warping the scale
# # plt.ylim(0, 100) 

# plt.show()