import sherpa_onnx
print("Sherpa-ONNX version:", sherpa_onnx.__version__)
print("OfflineRecognizer members:", dir(sherpa_onnx.OfflineRecognizer))
try:
    print("OfflineRecognizer help:")
    help(sherpa_onnx.OfflineRecognizer)
except:
    pass
