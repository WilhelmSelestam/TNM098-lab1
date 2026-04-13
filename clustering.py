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