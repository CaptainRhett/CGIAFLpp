import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# 使用更漂亮的图形风格
sns.set(style="whitegrid")

# 读取 CSV 数据（将内容保存为 'qasan_report.csv'）
df = pd.read_csv('leak_analysis.csv')

# 将时间字符串转为 pandas 的 datetime 对象
df['timestamp'] = pd.to_datetime(df['filename'].str.extract(r'qasan_report_(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})')[0], format='%Y-%m-%d_%H-%M-%S')

# 设置时间为索引
df = df.set_index('timestamp')

# 图1：分配、释放、遗漏释放次数
plt.figure(figsize=(12, 6))
plt.plot(df.index, df['a1_malloc_calls'], label='malloc calls')
plt.plot(df.index, df['a2_free_calls'], label='free calls')
plt.plot(df.index, df['a3_missing_frees'], label='missing frees')
plt.title('Memory Call Counts Over Time')
plt.xlabel('Time')
plt.ylabel('Count')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 图2：分配、释放、泄露字节数
plt.figure(figsize=(12, 6))
plt.plot(df.index, df['b1_alloc_bytes'], label='alloc bytes')
plt.plot(df.index, df['b2_free_bytes'], label='free bytes')
plt.plot(df.index, df['b3_leak_bytes'], label='leak bytes')
plt.title('Memory Bytes Over Time')
plt.xlabel('Time')
plt.ylabel('Bytes')
plt.legend()
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# 图3：运行时间
plt.figure(figsize=(12, 4))
plt.plot(df.index, df['c_run_time_sec'], marker='o', color='purple')
plt.title('Run Time Over Time')
plt.xlabel('Time')
plt.ylabel('Seconds')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
